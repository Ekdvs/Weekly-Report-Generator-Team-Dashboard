import { ReportStatus } from "@prisma/client";
import prisma from "../config/prisma.js";
import ApiError from "../utils/apiError.js";
import { CreateReportInput, ReportQueryInput, UpdateReportInput } from "../validators/report.validator.js";

/** Grace period after weekEnd before a submission counts as LATE. */
const GRACE_PERIOD_DAYS = 2;

const isLateSubmission = (weekEnd: Date, submittedAt: Date): boolean => {
  const deadline = new Date(weekEnd);
  deadline.setDate(deadline.getDate() + GRACE_PERIOD_DAYS);
  return submittedAt > deadline;
};

const ensureProjectExists = async (projectId: string) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw ApiError.badRequest("Project does not exist");
  }
};

//create project
export const createReport = async (userId: string, input: CreateReportInput) => {
  await ensureProjectExists(input.projectId);

  return prisma.report.create(
    {
      data: {
        weekStart: input.weekStart,
        weekEnd: input.weekEnd,
        projectId: input.projectId,
        tasksCompleted: input.tasksCompleted,
        tasksPlanned: input.tasksPlanned,
        blockers: input.blockers,
        hoursWorked: input.hoursWorked,
        notes: input.notes,
        status: ReportStatus.DRAFT,
        userId,
      },
      include: { project: true },
    }
  );
};

// Fetches a report and throws 404 if missing.
const getReportOr404 = async (id: string) => {
  const report = await prisma.report.findUnique({
    where: { id },
    include: { project: true, user: { select: { id: true, name: true, email: true } } },
  });
  if (!report) {
    throw ApiError.notFound("Report not found");
  }
  return report;
};

//get report for requester
export const getReportForRequester = async (
  id: string,
  requesterId: string,
  requesterRole: "MANAGER" | "TEAM_MEMBER"
) => {
  const report = await getReportOr404(id);

  if (requesterRole !== "MANAGER" && report.userId !== requesterId) {
    throw ApiError.forbidden("You do not have access to this report");
  }

  return report;
};

// update the report
export const updateReport = async (
  id: string,
  requesterId: string,
  input: UpdateReportInput
) => {
  const report = await getReportOr404(id);

  if (report.userId !== requesterId) {
    throw ApiError.forbidden("You can only edit your own reports");
  }

  if (report.status !== ReportStatus.DRAFT) {
    throw ApiError.forbidden("Only draft reports can be edited");
  }

  if (input.projectId) {
    await ensureProjectExists(input.projectId);
  }

  const nextWeekStart = input.weekStart ?? report.weekStart;
  const nextWeekEnd = input.weekEnd ?? report.weekEnd;
  if (nextWeekEnd < nextWeekStart) {
    throw ApiError.badRequest("weekEnd must be the same as or after weekStart");
  }

  return prisma.report.update({
    where: { id },
    data: input,
    include: { project: true },
  });
};

// submit the report
export const submitReport = async (id: string, requesterId: string) => {
  const report = await getReportOr404(id);

  if (report.userId !== requesterId) {
    throw ApiError.forbidden("You can only submit your own reports");
  }

  if (report.status !== ReportStatus.DRAFT) {
    throw ApiError.conflict("This report has already been submitted");
  }

  const submittedAt = new Date();
  const status = isLateSubmission(report.weekEnd, submittedAt)
    ? ReportStatus.LATE
    : ReportStatus.SUBMITTED;

  return prisma.report.update({
    where: { id },
    data: { status, submittedAt },
    include: { project: true },
  });
};

//ow report history (team member view)
export const getMyReports = async (userId: string, query: ReportQueryInput) => {
  const { projectId, status, dateFrom, dateTo, page, limit } = query;

  const where = {
    userId,
    ...(projectId && { projectId }),
    ...(status && { status }),
    ...((dateFrom || dateTo) && {
      weekStart: {
        ...(dateFrom && { gte: dateFrom }),
        ...(dateTo && { lte: dateTo }),
      },
    }),
  };

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      include: { project: true },
      orderBy: { weekStart: "desc" },//new report come frist
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.report.count({ where }),
  ]);

  return {
    reports,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

// report view for manager with filters
export const listAllReports = async (query: ReportQueryInput) => {
  const { projectId, userId, status, dateFrom, dateTo, page, limit } = query;

  const where = {
    ...(projectId && { projectId }),
    ...(userId && { userId }),
    ...(status && { status }),
    ...((dateFrom || dateTo) && {
      weekStart: {
        ...(dateFrom && { gte: dateFrom }),
        ...(dateTo && { lte: dateTo }),
      },
    }),
  };

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      include: {
        project: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { weekStart: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.report.count({ where }),
  ]);

  return {
    reports,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

