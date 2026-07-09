import { AlertTriangle } from "lucide-react";
import { Card, CardHeader, EmptyState } from "../ui/Primitives";
import { formatWeekRange } from "../../lib/utils";
import type { BlockerRow } from "../../types";


export const OpenBlockersList = ({ blockers }: { blockers: BlockerRow[] }) => {
  return (
    <Card>
      <CardHeader title="Open blockers" subtitle="Flagged challenges for the selected week" />
      {blockers.length === 0 ? (
        <EmptyState title="No blockers reported" description="The team is clear this week." />
      ) : (
        <ul className="space-y-3">
          {blockers.map((row) => (
            <li key={row.id} className="flex gap-3 rounded-lg border border-rose-100 bg-rose-50/50 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
              <div>
                <p className="text-sm font-medium text-ink">
                  {row.user.name} <span className="font-normal text-ink-soft">· {row.project.name}</span>
                </p>
                <p className="mt-0.5 text-sm text-ink-soft">{row.blockers}</p>
                <p className="mt-1 text-xs text-ink-soft">
                  Week of {formatWeekRange(row.weekStart, row.weekEnd)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
