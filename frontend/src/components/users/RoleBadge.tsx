import { cn } from "../../lib/utils";
import type { Role } from "../../types";

const roleStyles: Record<Role, string> = {
  MANAGER: "bg-blue-200 text-brand-700",
  TEAM_MEMBER: "bg-slate-100 text-ink-soft",
};

const roleLabels: Record<Role, string> = {
  MANAGER: "Manager",
  TEAM_MEMBER: "Team Member",
};

export const RoleBadge = ({ role }: { role: Role }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
      roleStyles[role]
    )}
  >
    {roleLabels[role]}
  </span>
);