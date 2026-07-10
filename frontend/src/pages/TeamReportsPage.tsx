import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Topbar } from "../components/layout/Topbar";
import { Input, Select } from "../components/ui/FormFields";
import {
    EmptyState,
    ErrorState,
    Spinner,
    StatusBadge,
} from "../components/ui/Primitives";
import { Button } from "../components/ui/Button";

import { useProjects } from "../hooks/useProjects";
import { useUsers } from "../hooks/useUsers";
import { useAllReports } from "../hooks/useAllReports";

import type { ReportStatus } from "../types";


const PAGE_SIZE = 15;


const formatWeekRange = (start: string, end: string) => {
    const s = new Date(start).toLocaleDateString();
    const e = new Date(end).toLocaleDateString();
    return `${s} - ${e}`;
};


export const TeamReportsPage = () => {

    const { projects } = useProjects();
    const { users: members } = useUsers("TEAM_MEMBER");

    const [userId, setUserId] = useState("");
    const [projectId, setProjectId] = useState("");
    const [status, setStatus] = useState<ReportStatus | "">("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [page, setPage] = useState(1);

    const { reports, pagination, isLoading, error } = useAllReports({
        userId: userId || undefined,
        projectId: projectId || undefined,
        status: status || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        page,
        limit: PAGE_SIZE,
    });

    // Generic so it works with plain string setters (userId, projectId,
    // dateFrom, dateTo) AND the ReportStatus | "" setter (status),
    // without TS complaining about assignability.
    const updateFilter = <T,>(setter: (value: T) => void) => (value: T) => {
        setter(value);
        setPage(1);
    };

    return (
        <>
            <Topbar
                title="All Team Reports"
                subtitle="Review reports submitted by all team members"
            />

            <div className="space-y-6 p-8">

                {/* FILTERS */}
                <div className="flex flex-wrap items-end gap-3">

                    <Select
                        label="Team Member"
                        className="w-48"
                        value={userId}
                        onChange={(e) => updateFilter<string>(setUserId)(e.target.value)}
                    >
                        <option value="">Everyone</option>
                        {members.map(member => (
                            <option key={member.id} value={member.id}>
                                {member.name}
                            </option>
                        ))}
                    </Select>

                    <Select
                        label="Project"
                        className="w-48"
                        value={projectId}
                        onChange={(e) => updateFilter<string>(setProjectId)(e.target.value)}
                    >
                        <option value="">All Projects</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </Select>

                    <Select
                        label="Status"
                        className="w-40"
                        value={status}
                        onChange={(e) =>
                            updateFilter<ReportStatus | "">(setStatus)(
                                e.target.value as ReportStatus | ""
                            )
                        }
                    >
                        <option value="">Any Status</option>
                        <option value="DRAFT">Draft</option>
                        <option value="SUBMITTED">Submitted</option>
                        <option value="LATE">Late</option>
                    </Select>

                    <Input
                        label="From"
                        type="date"
                        className="w-40"
                        value={dateFrom}
                        onChange={(e) => updateFilter<string>(setDateFrom)(e.target.value)}
                    />

                    <Input
                        label="To"
                        type="date"
                        className="w-40"
                        value={dateTo}
                        onChange={(e) => updateFilter<string>(setDateTo)(e.target.value)}
                    />

                </div>

                {/* STATES */}
                {isLoading && <Spinner />}

                {error && <ErrorState message={error} />}

                {!isLoading && !error && reports.length === 0 && (
                    <EmptyState
                        title="No reports found"
                        description="Try changing your filters."
                    />
                )}

                {!isLoading && !error && reports.length > 0 && (
                    <>
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-5 py-3">Member</th>
                                        <th className="px-5 py-3">Week</th>
                                        <th className="px-5 py-3">Project</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3">Completed Tasks</th>
                                        <th className="px-5 py-3 text-right">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {reports.map((report) => (
                                        <tr key={report.id}>
                                            <td className="px-5 py-3">
                                                <div className="font-medium">
                                                    {report.user?.name ?? "Unknown"}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {report.user?.email ?? ""}
                                                </div>
                                            </td>

                                            <td className="px-5 py-3 text-slate-600">
                                                {formatWeekRange(report.weekStart, report.weekEnd)}
                                            </td>

                                            <td className="px-5 py-3 text-slate-600">
                                                {report.project.name}
                                            </td>

                                            <td className="px-5 py-3">
                                                <StatusBadge status={report.status} />
                                            </td>

                                            <td className="px-5 py-3 max-w-xs truncate text-slate-600">
                                                {report.tasksCompleted}
                                            </td>

                                            <td className="px-5 py-3 text-right">
                                                <Link
                                                    to={`/team-reports/${report.id}`}
                                                    className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline"
                                                >
                                                    Open
                                                    <ArrowRight className="h-3 w-3" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-slate-500">
                                    Page {pagination.page} of {pagination.totalPages}
                                    &nbsp;•&nbsp;
                                    {pagination.total} reports
                                </p>

                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        disabled={page <= 1}
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    >
                                        Previous
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        disabled={page >= pagination.totalPages}
                                        onClick={() => setPage((p) => p + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}

            </div>
        </>
    );
};