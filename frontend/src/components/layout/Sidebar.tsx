import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, FolderKanban, PlusCircle } from "lucide-react";
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

const linkClasses = (isActive: boolean) =>
  cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
    isActive
      ? "bg-brand-700/20 text-white"
      : "text-slate-300 hover:bg-nav-hover hover:text-white"
  );

export const Sidebar = () => {
  const { user } = useAuth();
  const isManager = user?.role === "MANAGER";

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-nav px-4 py-6">
      <div className="mb-8 flex items-center gap-3 px-2">
        <DotMark />
        <div>
          <p className="font-display text-sm font-semibold text-white">Weekly Reports</p>
          <p className="text-xs text-slate-400">Team activity, in sync</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {!isManager && (
          <>
            <NavLink to="/reports" end className={({ isActive }) => linkClasses(isActive)}>
              <FileText className="h-4 w-4" />
              My Reports
            </NavLink>
            <NavLink to="/reports/new" className={({ isActive }) => linkClasses(isActive)}>
              <PlusCircle className="h-4 w-4" />
              New Report
            </NavLink>
          </>
        )}

        {isManager && (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => linkClasses(isActive)}>
              <LayoutDashboard className="h-4 w-4" />
              Team Dashboard
            </NavLink>
            <NavLink to="/projects" className={({ isActive }) => linkClasses(isActive)}>
              <FolderKanban className="h-4 w-4" />
              Projects
            </NavLink>
            <NavLink to="/reports" end className={({ isActive }) => linkClasses(isActive)}>
              <FileText className="h-4 w-4" />
              My Reports
            </NavLink>
          </>
        )}
      </nav>

      <div className="rounded-lg bg-nav-hover px-3 py-3">
        <p className="text-xs text-slate-400">Signed in as</p>
        <p className="truncate text-sm font-medium text-white">{user?.name}</p>
        <p className="mt-0.5 text-xs text-brand-300">
          {isManager ? "Manager" : "Team Member"}
        </p>
      </div>
    </aside>
  );
};
