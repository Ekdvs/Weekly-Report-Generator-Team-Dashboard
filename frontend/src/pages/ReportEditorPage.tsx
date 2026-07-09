import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { createReportRequest, getReportRequest, submitReportRequest, updateReportRequest } from "../api/report.api";
import { ReportForm, type ReportFormSchema } from "../components/reports/ReportForm";
import { Topbar } from "../components/layout/Topbar";
import { Card, ErrorState, Spinner, StatusBadge } from "../components/ui/Primitives";
import { Button } from "../components/ui/Button";
import { toDateInputValue } from "../lib/utils";
import type { Report } from "../types";
import { useProjects } from "../hooks/useProjects";


export const ReportEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new" || !id;
  const navigate = useNavigate();
  const { projects, isLoading: projectsLoading } = useProjects();

  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  useEffect(() => {
    if (isNew) return;
    let isMounted = true;
    getReportRequest(id!)
      .then(({ data }) => {
        if (isMounted) setReport(data.data as Report);
      })
      .catch((err) => {
        if (isMounted) setError(err.response?.data?.message || "Report not found");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [id, isNew]);

  const handleCreate = async (values: ReportFormSchema) => {
    const { data } = await createReportRequest(values);
    const report = data.data as Report;
    navigate(`/reports/${report.id}`);
  };

  const handleUpdate = async (values: ReportFormSchema) => {
    const { data } = await updateReportRequest(id!, values);
    setReport(data.data as Report);
  };

  const handleSubmitReport = async () => {
    if (!id) return;
    if (!window.confirm("Submit this report? You won't be able to edit it afterward.")) return;
    setIsSubmittingReport(true);
    try {
      const { data } = await submitReportRequest(id);
      setReport(data.data as Report);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || "Could not submit the report");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  if (isLoading || projectsLoading) {
    return (
      <>
        <Topbar title="Report" />
        <Spinner />
      </>
    );
  }

  const isDraft = isNew || report?.status === "DRAFT";

  return (
    <>
      <Topbar
        title={isNew ? "New weekly report" : "Weekly report"}
        subtitle={isNew ? "Fill in this week's update" : undefined}
      />

      <div className="mx-auto max-w-2xl p-8">
        <Link to="/reports" className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
          <ArrowLeft className="h-4 w-4" />
          Back to my reports
        </Link>

        {error && (
          <div className="mb-4">
            <ErrorState message={error} />
          </div>
        )}

        <Card>
          {report && (
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
              <StatusBadge status={report.status} />
              {report.submittedAt && (
                <span className="text-xs text-ink-soft">
                  Submitted {new Date(report.submittedAt).toLocaleString()}
                </span>
              )}
            </div>
          )}

          <ReportForm
            projects={projects}
            readOnly={!isDraft}
            submitLabel={isNew ? "Create draft" : "Save changes"}
            defaultValues={
              report
                ? {
                    weekStart: toDateInputValue(report.weekStart),
                    weekEnd: toDateInputValue(report.weekEnd),
                    projectId: report.projectId,
                    tasksCompleted: report.tasksCompleted,
                    tasksPlanned: report.tasksPlanned,
                    blockers: report.blockers ?? "",
                    hoursWorked: report.hoursWorked ?? undefined,
                    notes: report.notes ?? "",
                  }
                : undefined
            }
            onSubmit={isNew ? handleCreate : handleUpdate}
          />

          {!isNew && isDraft && (
            <div className="mt-5 border-t border-slate-100 pt-5">
              <Button onClick={handleSubmitReport} isLoading={isSubmittingReport} variant="primary">
                <CheckCircle2 className="h-4 w-4" />
                Submit report
              </Button>
              <p className="mt-2 text-xs text-ink-soft">
                Once submitted, this report is locked and visible on the manager dashboard.
              </p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};
