import type { SubmissionStatusRow } from "../../types";
import { Card, CardHeader, EmptyState, StatusBadge } from "../ui/Primitives";


export const SubmissionStatusTable = ({ rows }: { rows: SubmissionStatusRow[] }) => {
  return (
    <Card>
      <CardHeader title="Submission status" subtitle="Per team member, for the selected week" />
      {rows.length === 0 ? (
        <EmptyState title="No team members found" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-100">
          <table className="w-full text-sm">
            <thead className="bg-surface-sunken text-left text-xs font-medium uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-2.5">Team member</th>
                <th className="px-4 py-2.5">Project</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.userId}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{row.name}</p>
                    <p className="text-xs text-ink-soft">{row.email}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{row.project ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};
