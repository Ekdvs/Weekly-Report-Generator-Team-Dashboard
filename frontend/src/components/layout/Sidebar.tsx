import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, FolderKanban, PlusCircle, Users, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";


const DotMark = () => (
  <div className="grid grid-cols-3 gap-[3px]">
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <span
        key={i}
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          i % 2 === 0 ? "bg-brand-500" : "bg-brand-300"
        )}
      />
    ))}
  </div>
);

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
  iconColorClass: string;
}

const NavItem = ({ to, icon: Icon, label, end, iconColorClass }: NavItemProps) => (
  <NavLink to={to} end={end}>
    {({ isActive }) => (
      <div
        className={cn(
          "group relative flex items-center gap-3 rounded-lg py-2.5 pl-4 pr-3 text-sm font-medium transition-all duration-150",
          isActive
            ? "bg-blue-600 text-white"
            : "text-slate-400 hover:bg-blue-400 hover:text-black hover:pl-[18px]"
        )}
      >
        {/* Active accent bar */}
        <span
          className={cn(
            "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-brand-400 transition-opacity",
            isActive ? "opacity-100" : "opacity-0"
          )}
        />

        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors",
            isActive
              ? iconColorClass
              : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
          )}
        >
          <Icon className="h-4 w-4" />
        </span>

        <span className="truncate">{label}</span>
      </div>
    )}
  </NavLink>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-2 mt-6 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 first:mt-0">
    {children}
  </p>
);

export const Sidebar = () => {
  const { user } = useAuth();
  const isManager = user?.role === "MANAGER";

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-nav px-3 py-6">
      <div className="mb-2 flex items-center gap-3 px-3">
        <DotMark />
        <div>
          <p className="font-display text-sm font-semibold text-white">Weekly Reports</p>
          <p className="text-xs text-slate-500">Team activity, in sync</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {!isManager && (
          <>
            <SectionLabel>Reports</SectionLabel>
            <div className="space-y-1">
              <NavItem
                to="/reports"
                end
                icon={FileText}
                label="My Reports"
                iconColorClass="bg-brand-500/20 text-brand-300"
              />
              <NavItem
                to="/reports/new"
                icon={PlusCircle}
                label="New Report"
                iconColorClass="bg-emerald-500/20 text-emerald-300"
              />
            </div>
          </>
        )}

        {isManager && (
          <>
            <SectionLabel>Overview</SectionLabel>
            <div className="space-y-1">
              <NavItem
                to="/dashboard"
                icon={LayoutDashboard}
                label="Team Dashboard"
                iconColorClass="bg-brand-500/20 text-brand-300"
              />
            </div>

            <SectionLabel>Manage</SectionLabel>
            <div className="space-y-1">
              <NavItem
                to="/projects"
                icon={FolderKanban}
                label="Projects"
                iconColorClass="bg-amber-500/20 text-amber-300"
              />
              <NavItem
                to="/users"
                icon={Users}
                label="User Management"
                iconColorClass="bg-violet-500/20 text-violet-300"
              />
            </div>

            <SectionLabel>Reports</SectionLabel>
            <div className="space-y-1">
              <NavItem
                to="/team-reports"
                icon={FileText}
                label="All Team Reports"
                iconColorClass="bg-emerald-500/20 text-emerald-300"
              />
            </div>
          </>
        )}
      </nav>

      <div className="mt-6 rounded-lg bg-white/5 px-3 py-3">
        <p className="text-xs text-slate-500">Signed in as</p>
        <p className="truncate text-sm font-medium text-white">{user?.name}</p>
        <p
          className={cn(
            "mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
            isManager ? "bg-blue-600 text-white" : "bg-red-500 text-white"
          )}
        >
          {isManager ? "Manager" : "Team Member"}
        </p>
      </div>
    </aside>
  );
};