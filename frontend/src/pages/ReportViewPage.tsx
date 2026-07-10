import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useReport } from "../hooks/useReport";
import { submitReportRequest } from "../api/report.api";
import { Topbar } from "../components/layout/Topbar";
import { Card, CardHeader, ErrorState, Spinner, StatusBadge } from "../components/ui/Primitives";
import { Button } from "../components/ui/Button";




const formatDate = (value: string) => new Date(value).toLocaleDateString();

const formatWeekRange = (start: string, end: string) =>
    `${formatDate(start)} - ${formatDate(end)}`;

const DetailRow = ({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) => (
    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-4 sm:gap-4">
        <dt className="text-sm font-medium text-ink-soft">{label}</dt>
        <dd className="col-span-3 whitespace-pre-wrap text-sm text-ink">{children}</dd>
    </div>
);

export const ReportViewPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { user } = useAuth();
    const { report, isLoading, error, refetch } = useReport(id);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const isOwner = !!user && !!report && report.userId === user.id;
    const isManager = user?.role === "MANAGER";
    const canEdit = isOwner && report?.status === "DRAFT";

    const handleSubmit = async () => {
        if (!report) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await submitReportRequest(report.id);
            await refetch();
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } };
            setSubmitError(e.response?.data?.message || "Failed to submit report");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Topbar
                title="Weekly Report"
                subtitle={
                    isManager
                        ? "Viewing a team member's submitted report"
                        : "View and manage your report"
                }
            />

            <div className="space-y-6 p-8">
                <Link
                    to={isManager ? "/team-reports" : "/reports"}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to reports
                </Link>

                {isLoading && <Spinner />}

                {!isLoading && error && <ErrorState message={error} />}

                {!isLoading && !error && !report && (
                    <ErrorState message="Report not found." />
                )}

                {!isLoading && !error && report && (
                    <>
                        <Card>
                            <CardHeader
                                title={formatWeekRange(report.weekStart, report.weekEnd)}
                                subtitle={
                                    report.user
                                        ? `${report.user.name}${
                                              report.user.email ? ` • ${report.user.email}` : ""
                                          }`
                                        : undefined
                                }
                                action={<StatusBadge status={report.status} />}
                            />

                            <dl className="divide-y divide-slate-100">
                                <DetailRow label="Project">
                                    {"name" in report.project ? report.project.name : ""}
                                </DetailRow>

                                <DetailRow label="Tasks Completed">
                                    {report.tasksCompleted}
                                </DetailRow>

                                <DetailRow label="Tasks Planned">
                                    {report.tasksPlanned}
                                </DetailRow>

                                <DetailRow label="Blockers">
                                    {report.blockers || (
                                        <span className="text-ink-soft">None reported</span>
                                    )}
                                </DetailRow>

                                <DetailRow label="Hours Worked">
                                    {report.hoursWorked != null ? (
                                        report.hoursWorked
                                    ) : (
                                        <span className="text-ink-soft">Not provided</span>
                                    )}
                                </DetailRow>

                                <DetailRow label="Notes">
                                    {report.notes || (
                                        <span className="text-ink-soft">No additional notes</span>
                                    )}
                                </DetailRow>

                                <DetailRow label="Submitted At">
                                    {report.submittedAt ? (
                                        new Date(report.submittedAt).toLocaleString()
                                    ) : (
                                        <span className="text-ink-soft">Not submitted yet</span>
                                    )}
                                </DetailRow>
                            </dl>
                        </Card>

                        {submitError && <ErrorState message={submitError} />}

                        {canEdit && (
                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="secondary"
                                    onClick={() => navigate(`/reports/${report.id}/edit`)}
                                >
                                    Edit Report
                                </Button>

                                <Button onClick={handleSubmit} disabled={isSubmitting}>
                                    {isSubmitting && (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    )}
                                    Submit Report
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};