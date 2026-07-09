import { useState } from "react";
import { DashboardFilters, type DashboardFilterState } from "../components/dashboard/DashboardFilters";
import { useProjects } from "../hooks/useProjects";
import { useUsers } from "../hooks/useUsers";
import { useDashboardOverview, useTasksTrend, useWorkloadByProject } from "../hooks/useDashboard";
import { Topbar } from "../components/layout/Topbar";
import { ErrorState, Spinner } from "../components/ui/Primitives";
import { SummaryCards } from "../components/dashboard/SummaryCards";
import { TasksTrendChart } from "../components/dashboard/TasksTrendChart";
import { WorkloadChart } from "../components/dashboard/WorkloadChart";
import { SubmissionStatusTable } from "../components/dashboard/SubmissionStatusTable";
import { OpenBlockersList } from "../components/dashboard/OpenBlockersList";
import { RecentActivityFeed } from "../components/dashboard/RecentActivityFeed";
import { AiChatWidget } from "../components/ai/AiChatWidget";


const todayIso = () => new Date().toISOString().slice(0, 10);

export const TeamDashboardPage = () => {
  const [filters, setFilters] = useState<DashboardFilterState>({
    week: todayIso(),
    projectId: "",
    userId: "",
  });

  const { projects } = useProjects();
  const { users: members } = useUsers("TEAM_MEMBER");

  const overviewFilters = {
    week: filters.week || undefined,
    projectId: filters.projectId || undefined,
    userId: filters.userId || undefined,
  };

  const { summary, submissionStatus, blockers, activity, isLoading, error } =
    useDashboardOverview(overviewFilters);
  const { trend } = useTasksTrend({
    weeks: 8,
    projectId: filters.projectId || undefined,
    userId: filters.userId || undefined,
  });
  const { workload } = useWorkloadByProject({ userId: filters.userId || undefined });

  return (
    <>
      <Topbar title="Team Dashboard" subtitle="Submissions, blockers, and workload at a glance" />

      <div className="space-y-6 p-8">
        <DashboardFilters value={filters} onChange={setFilters} projects={projects} members={members} />

        {isLoading && <Spinner />}
        {error && <ErrorState message={error} />}

        {summary && !isLoading && (
          <>
            <SummaryCards summary={summary} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <TasksTrendChart trend={trend} />
              <WorkloadChart workload={workload} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <SubmissionStatusTable rows={submissionStatus} />
              <div className="space-y-6">
                <OpenBlockersList blockers={blockers} />
                <RecentActivityFeed activity={activity} />
              </div>
            </div>
          </>
        )}
      </div>

      <AiChatWidget />
    </>
  );
};
