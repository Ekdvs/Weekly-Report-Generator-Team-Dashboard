import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";
import type { ReportStatus } from "../../types";
import { Loader2 } from "lucide-react";


export const Card = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("rounded-xl border border-slate-200/70 bg-white p-5 shadow-card", className)}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) => (
  <div className="mb-4 flex items-start justify-between gap-3">
    <div>
      <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      {subtitle && <p className="mt-0.5 text-sm text-ink-soft">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const statusStyles: Record<ReportStatus | "PENDING", string> = {
  SUBMITTED: "bg-status-submittedBg text-status-submitted",
  LATE: "bg-status-lateBg text-status-late",
  DRAFT: "bg-status-draftBg text-status-draft",
  PENDING: "bg-status-pendingBg text-status-pending",
};

const statusLabels: Record<ReportStatus | "PENDING", string> = {
  SUBMITTED: "Submitted",
  LATE: "Late",
  DRAFT: "Draft",
  PENDING: "Pending",
};

export const StatusBadge = ({ status }: { status: ReportStatus | "PENDING" }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
      statusStyles[status]
    )}
  >
    {statusLabels[status]}
  </span>
);

export const Spinner = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center py-10", className)}>
    <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
  </div>
);

export const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-12 text-center">
    <p className="font-display text-sm font-semibold text-ink">{title}</p>
    {description && <p className="mt-1 max-w-sm text-sm text-ink-soft">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const ErrorState = ({ message }: { message: string }) => (
  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
    {message}
  </div>
);
