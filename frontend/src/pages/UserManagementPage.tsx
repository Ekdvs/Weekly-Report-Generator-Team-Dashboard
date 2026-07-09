import { useMemo, useState } from "react";
import { Search, Users as UsersIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { Role, User } from "../types";
import { useUsers } from "../hooks/useUsers";
import { Topbar } from "../components/layout/Topbar";
import { Card, EmptyState, ErrorState, Spinner } from "../components/ui/Primitives";
import { Select } from "../components/ui/FormFields";
import { RoleBadge } from "../components/users/RoleBadge";
import { formatDate } from "../lib/utils";
import { RoleAction } from "../components/users/RoleAction";

export const UserManagementPage = () => {
  const { user: currentUser } = useAuth();
  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const [search, setSearch] = useState("");

  const { users, isLoading, error, refetch } = useUsers(roleFilter || undefined);


  const [rowOverrides, setRowOverrides] = useState<Record<string, User>>({});

  const rows = useMemo(
    () => users.map((u) => rowOverrides[u.id] ?? u),
    [users, rowOverrides]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const managerCount = rows.filter((u) => u.role === "MANAGER").length;
  const memberCount = rows.filter((u) => u.role === "TEAM_MEMBER").length;

  return (
    <>
      <Topbar title="User Management" subtitle="Team directory and role assignment" />

      <div className="space-y-6 p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 ">
          <Card className="flex items-center gap-3 ">
            <div className="rounded-lg bg-brand-50 p-2 text-brand-700">
              <UsersIcon className="h-5 w-5" />
            </div>
            <div >
              <p className="text-sm text-ink-soft">Total users</p>
              <p className="tabular font-display text-2xl font-semibold text-ink">
                {rows.length}
              </p>
            </div>
          </Card>
          <Card>
            <p className="text-sm text-ink-soft">Managers</p>
            <p className="tabular font-display text-2xl font-semibold text-ink">{managerCount}</p>
          </Card>
          <Card>
            <p className="text-sm text-ink-soft">Team members</p>
            <p className="tabular font-display text-2xl font-semibold text-ink">{memberCount}</p>
          </Card>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="w-64">
            <label className="mb-1.5 block text-sm font-medium text-ink">Search</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
              />
            </div>
          </div>
          <Select
            label="Role"
            className="w-48"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as Role | "")}
          >
            <option value="">All roles</option>
            <option value="MANAGER">Manager</option>
            <option value="TEAM_MEMBER">Team Member</option>
          </Select>
        </div>

        {isLoading && <Spinner />}
        {error && <ErrorState message={error} />}

        {!isLoading && !error && filtered.length === 0 && (
          <EmptyState
            title="No users found"
            description="Try a different search term or role filter."
          />
        )}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-surface-sunken text-left text-xs font-medium uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td className="px-5 py-3 font-medium text-ink">{u.name}</td>
                    <td className="px-5 py-3 text-ink-soft">{u.email}</td>
                    <td className="px-5 py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-5 py-3 text-ink-soft">
                      {u.createdAt ? formatDate(u.createdAt) : "—"}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <RoleAction
                        user={u}
                        isSelf={u.id === currentUser?.id}
                        onChanged={(updated) => {
                          setRowOverrides((prev) => ({ ...prev, [updated.id]: updated }));
                          refetch();
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};