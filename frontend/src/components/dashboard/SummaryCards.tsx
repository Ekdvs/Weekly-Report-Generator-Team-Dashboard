import { AlertTriangle, FileCheck2, TrendingUp } from "lucide-react";
import type { DashboardSummary } from "../../types";
import { Card } from "../ui/Primitives";

export const SummaryCards = ({ summary }: { summary: DashboardSummary }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-soft">Reports submitted this week</p>
          <p className="tabular mt-2 font-display text-3xl font-semibold text-ink">
            {summary.totalReportsSubmitted}
            <span className="ml-1 text-base font-normal text-ink-soft">
              / {summary.totalTeamMembers}
            </span>
          </p>
        </div>
        <div className="rounded-lg bg-brand-50 p-2 text-brand-700">
          <FileCheck2 className="h-5 w-5" />
        </div>
      </Card>

      <Card className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-soft">Submission compliance</p>
          <p className="tabular mt-2 font-display text-3xl font-semibold text-ink">
            {summary.complianceRate}%
          </p>
        </div>
        <div className="rounded-lg bg-brand-50 p-2 text-brand-700">
          <TrendingUp className="h-5 w-5" />
        </div>
      </Card>

      <Card className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-soft">Open blockers</p>
          <p className="tabular mt-2 font-display text-3xl font-semibold text-ink">
            {summary.openBlockers}
          </p>
        </div>
        <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
      </Card>
    </div>
  );
};
