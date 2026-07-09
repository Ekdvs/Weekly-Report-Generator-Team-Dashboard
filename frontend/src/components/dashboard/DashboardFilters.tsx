import type { Project, User } from "../../types";
import { Input, Select } from "../ui/FormFields";


export interface DashboardFilterState {
  week: string;
  projectId: string;
  userId: string;
}

interface DashboardFiltersProps {
  value: DashboardFilterState;
  onChange: (value: DashboardFilterState) => void;
  projects: Project[];
  members: User[];
}

export const DashboardFilters = ({ value, onChange, projects, members }: DashboardFiltersProps) => {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <Input
        label="Week of"
        type="date"
        value={value.week}
        onChange={(e) => onChange({ ...value, week: e.target.value })}
        className="w-40"
      />
      <Select
        label="Project"
        value={value.projectId}
        onChange={(e) => onChange({ ...value, projectId: e.target.value })}
        className="w-48"
      >
        <option value="">All projects</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </Select>
      <Select
        label="Team member"
        value={value.userId}
        onChange={(e) => onChange({ ...value, userId: e.target.value })}
        className="w-48"
      >
        <option value="">Everyone</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </Select>
    </div>
  );
};
