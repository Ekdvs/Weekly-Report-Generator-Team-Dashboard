export type Role = "TEAM_MEMBER" | "MANAGER";
export type ReportStatus = "DRAFT" | "SUBMITTED" | "LATE";

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: Pagination;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { reports: number };
  members?: User[];
}


export interface Report {
  id: string;
  weekStart: string;
  weekEnd: string;
  tasksCompleted: string;
  tasksPlanned: string;
  blockers?: string | null;
  hoursWorked?: number | null;
  notes?: string | null;
  status: ReportStatus;
  submittedAt?: string | null;
  projectId: string;
  project: Project | { id: string; name: string };
  userId: string;
  user?: { id: string; name: string; email?: string };
  createdAt: string;
  updatedAt: string;
}