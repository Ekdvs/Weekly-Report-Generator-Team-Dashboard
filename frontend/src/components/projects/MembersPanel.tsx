import { useState } from "react";
import { UserMinus, UserPlus } from "lucide-react";
import type { Project } from "../../types";
import { useUsers } from "../../hooks/useUsers";
import { assignMemberRequest, removeMemberRequest } from "../../api/project.api";
import { ErrorState } from "../ui/Primitives";
import { Select } from "../ui/FormFields";
import { Button } from "../ui/Button";


interface MembersPanelProps {
  project: Project;
  onUpdated: (project: Project) => void;
}

export const MembersPanel = ({ project, onUpdated }: MembersPanelProps) => {
  const { users } = useUsers("TEAM_MEMBER");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const memberIds = new Set((project.members ?? []).map((m) => m.id));
  const available = users.filter((u) => !memberIds.has(u.id));

  const handleAssign = async () => {
    if (!selectedUserId) return;
    setIsBusy(true);
    setError(null);
    try {
      const { data } = await assignMemberRequest(project.id, selectedUserId);
      onUpdated(data.data);
      setSelectedUserId("");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || "Could not assign this member");
    } finally {
      setIsBusy(false);
    }
  };

  const handleRemove = async (userId: string) => {
    setIsBusy(true);
    setError(null);
    try {
      const { data } = await removeMemberRequest(project.id, userId);
      onUpdated(data.data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || "Could not remove this member");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <ErrorState message={error} />}

      <div className="space-y-2">
        {(project.members ?? []).length === 0 && (
          <p className="text-sm text-ink-soft">No team members assigned yet.</p>
        )}
        {(project.members ?? []).map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium text-ink">{member.name}</p>
              <p className="text-xs text-ink-soft">{member.email}</p>
            </div>
            <button
              onClick={() => handleRemove(member.id)}
              disabled={isBusy}
              className="rounded-lg p-1.5 text-ink-soft hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
              aria-label={`Remove ${member.name}`}
            >
              <UserMinus className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-end gap-2 border-t border-slate-100 pt-4">
        <Select
          label="Add a team member"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="flex-1"
        >
          <option value="">Select a team member…</option>
          {available.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </Select>
        <Button onClick={handleAssign} disabled={!selectedUserId} isLoading={isBusy} size="md">
          <UserPlus className="h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
  );
};
