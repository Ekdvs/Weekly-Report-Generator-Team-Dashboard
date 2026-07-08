import { DashboardFilterInput, TrendFilterInput, WorkloadFilterInput } from "../validators/dashbord.validator.js";
import prisma from "../config/prisma.js";
import { ReportStatus } from "@prisma/client";

const getWeekBounds = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 = Sunday
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() + diffToMonday);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return { weekStart, weekEnd };
};

//Summary cards: total reports submitted this (or a given) week
export const getSummary = async (filters: DashboardFilterInput) => {
    const { weekStart, weekEnd } = getWeekBounds(filters.week ?? new Date());

    const reportWhere = {
        weekStart: { gte: weekStart, lte: weekEnd },
        ...(filters.projectId && { projectId: filters.projectId }),
        ...(filters.userId && { userId: filters.userId }),
    };

    const [totalTeamMembers, reportsThisWeek, submittedOrLate, openBlockers] =
        await Promise.all([
            prisma.user.count({ where: { role: "TEAM_MEMBER" } }),
            prisma.report.count({ where: reportWhere }),
            prisma.report.count({
                where: { ...reportWhere, status: { in: [ReportStatus.SUBMITTED, ReportStatus.LATE] } },
            }),
            prisma.report.count({
                where: {
                    ...reportWhere,
                    blockers: { not: null },
                    NOT: { blockers: "" },
                },
            }),
        ]);

    const complianceRate =
        totalTeamMembers === 0 ? 0 : Math.round((submittedOrLate / totalTeamMembers) * 100);

    return {
        week: { weekStart, weekEnd },
        totalReportsSubmitted: submittedOrLate,
        totalReportsThisWeek: reportsThisWeek,
        totalTeamMembers,
        complianceRate, // percentage of team members who have submitted
        openBlockers,
    };
};

// Per-team-member submission status (SUBMITTED / LATE / PENDING) for a given week.
export const getSubmissionStatus = async (filters: DashboardFilterInput) => {
    const { weekStart, weekEnd } = getWeekBounds(filters.week ?? new Date());

    const members = await prisma.user.findMany({
        where: {
            role: "TEAM_MEMBER",
            ...(filters.userId && { id: filters.userId }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            reports: {
                where: {
                    weekStart: { gte: weekStart, lte: weekEnd },
                    ...(filters.projectId && { projectId: filters.projectId }),
                },
                select: { id: true, status: true, submittedAt: true, project: { select: { name: true } } },
            },
        },
    });

    return members.map((member) => {
        const report = member.reports[0];
        return {
            userId: member.id,
            name: member.name,
            email: member.email,
            status: report ? report.status : "PENDING",
            submittedAt: report?.submittedAt ?? null,
            project: report?.project?.name ?? null,
            reportId: report?.id ?? null,
        };
    });
};

// Reports with a non-empty blockers field, most recent first. 
export const getOpenBlockers = async (filters: DashboardFilterInput) => {
    const { weekStart, weekEnd } = getWeekBounds(filters.week ?? new Date());

    return prisma.report.findMany({
        where: {
            weekStart: { gte: weekStart, lte: weekEnd },
            blockers: { not: null },
            NOT: { blockers: "" },
            ...(filters.projectId && { projectId: filters.projectId }),
            ...(filters.userId && { userId: filters.userId }),
        },
        select: {
            id: true,
            blockers: true,
            weekStart: true,
            weekEnd: true,
            status: true,
            user: { select: { id: true, name: true } },
            project: { select: { id: true, name: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: filters.limit,
    });
};

// Recent report activity feed (creations/submissions), most recent first. */
export const getRecentActivity = async (filters: DashboardFilterInput) => {
    return prisma.report.findMany({
        where: {
            ...(filters.projectId && { projectId: filters.projectId }),
            ...(filters.userId && { userId: filters.userId }),
        },
        select: {
            id: true,
            status: true,
            weekStart: true,
            weekEnd: true,
            submittedAt: true,
            updatedAt: true,
            user: { select: { id: true, name: true } },
            project: { select: { id: true, name: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: filters.limit,
    });
};

// Tasks-completed / submission volume trend across the last N weeks.
export const getTasksTrend = async (filters: TrendFilterInput) => {
    const { weekStart: currentWeekStart } = getWeekBounds(new Date());

    const rangeStart = new Date(currentWeekStart);
    rangeStart.setDate(rangeStart.getDate() - (filters.weeks - 1) * 7);

    const reports = await prisma.report.findMany({
        where: {
            weekStart: { gte: rangeStart },
            ...(filters.projectId && { projectId: filters.projectId }),
            ...(filters.userId && { userId: filters.userId }),
        },
        select: { weekStart: true, status: true },
    });

    // Bucket by week (yyyy-mm-dd of weekStart)
    const buckets = new Map<string, { week: string; reportsSubmitted: number; total: number }>();

    for (let i = 0; i < filters.weeks; i++) {
        const d = new Date(rangeStart);
        d.setDate(d.getDate() + i * 7);
        const key = d.toISOString().slice(0, 10);
        buckets.set(key, { week: key, reportsSubmitted: 0, total: 0 });
    }

    for (const report of reports) {
        const key = report.weekStart.toISOString().slice(0, 10);
        const bucket = buckets.get(key);
        if (bucket) {
            bucket.total += 1;
            if (report.status !== "DRAFT") bucket.reportsSubmitted += 1;
        }
    }

    return Array.from(buckets.values());
};

// Workload distribution — report count and total hours logged, grouped by project. 
export const getWorkloadByProject = async (filters: WorkloadFilterInput) => {
    const where = {
        ...(filters.userId && { userId: filters.userId }),
        ...((filters.dateFrom || filters.dateTo) && {
            weekStart: {
                ...(filters.dateFrom && { gte: filters.dateFrom }),
                ...(filters.dateTo && { lte: filters.dateTo }),
            },
        }),
    };

    const grouped = await prisma.report.groupBy({
        by: ["projectId"],
        where,
        _count: { _all: true },
        _sum: { hoursWorked: true },
    });

    const projects = await prisma.project.findMany({
        where: { id: { in: grouped.map((g) => g.projectId) } },
        select: { id: true, name: true },
    });
    const projectNameById = new Map(projects.map((p) => [p.id, p.name]));

    return grouped.map((g) => ({
        projectId: g.projectId,
        projectName: projectNameById.get(g.projectId) ?? "Unknown",
        reportCount: g._count._all,
        totalHours: g._sum.hoursWorked ?? 0,
    }));
};



