import { formatWeekRange } from "../../lib/utils";
import type { ActivityRow } from "../../types";
import { Card, CardHeader, EmptyState, StatusBadge } from "../ui/Primitives";


const timeAgo = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const RecentActivityFeed = ({ activity }: { activity: ActivityRow[] }) => {
  return (
    <Card>
      <CardHeader title="Recent activity" subtitle="Latest report updates across the team" />
      {activity.length === 0 ? (
        <EmptyState title="No recent activity" />
      ) : (
        <ul className="space-y-3">
          {activity.slice(0, 8).map((row) => (
            <li key={row.id} className="flex items-start justify-between gap-3 text-sm">
              <div>
                <p className="font-medium text-ink">
                  {row.user.name} <span className="font-normal text-ink-soft">· {row.project.name}</span>
                </p>
                <p className="text-xs text-ink-soft">
                  Week of {formatWeekRange(row.weekStart, row.weekEnd)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StatusBadge status={row.status} />
                <span className="text-xs text-ink-soft">{timeAgo(row.updatedAt)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
