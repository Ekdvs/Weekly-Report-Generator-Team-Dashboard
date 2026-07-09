import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { Topbar } from "../components/layout/Topbar";
import { Select } from "../components/ui/FormFields";
import { Button } from "../components/ui/Button";
import { EmptyState, ErrorState, Spinner } from "../components/ui/Primitives";
import { formatWeekRange } from "../lib/utils";
import { useMyReports } from "../hooks/useMyReports";
import { ReportCard } from "../components/reports/ReportCard";

export const MyReportsPage = () => {
  const [projectId, setProjectId] = useState("");
  const { projects } = useProjects();
  const { reports, isLoading, error } = useMyReports({
    projectId: projectId || undefined,
    limit: 100,
  });

  const grouped = useMemo(() => {
    const map = new Map<string, typeof reports>();
    for (const report of reports) {
      const key = `${report.weekStart}__${report.weekEnd}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(report);
    }
    return Array.from(map.entries());
  }, [reports]);

  return (
    <>
      <Topbar title="My Reports" subtitle="Your weekly report history, organized by week" />

      <div className="p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Select
            className="max-w-xs"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>

          <Link to="/reports/new">
            <Button>
              <PlusCircle className="h-4 w-4" />
              New report
            </Button>
          </Link>
        </div>

        {isLoading && <Spinner />}
        {error && <ErrorState message={error} />}

        {!isLoading && !error && reports.length === 0 && (
          <EmptyState
            title="No reports yet"
            description="Create your first weekly report to start building your history."
            action={
              <Link to="/reports/new">
                <Button>Create your first report</Button>
              </Link>
            }
          />
        )}

        <div className="space-y-8">
          {grouped.map(([key, weekReports]) => {
            const [weekStart, weekEnd] = key.split("__");
            return (
              <section key={key}>
                <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-ink-soft">
                  Week of {formatWeekRange(weekStart, weekEnd)}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {weekReports!.map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
};
