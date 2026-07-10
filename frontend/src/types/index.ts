export type Role = "TEAM_MEMBER" | "MANAGER";
export type ReportStatus = "DRAFT" | "SUBMITTED" | "LATE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
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

export interface SubmissionStatusRow {
  userId: string;
  name: string;
  email: string;
  status: ReportStatus | "PENDING";
  submittedAt: string | null;
  project: string | null;
  reportId: string | null;
}

export interface DashboardSummary {
  week: { weekStart: string; weekEnd: string };
  totalReportsSubmitted: number;
  totalReportsThisWeek: number;
  totalTeamMembers: number;
  complianceRate: number;
  openBlockers: number;
}

export interface BlockerRow {
  id: string;
  blockers: string;
  weekStart: string;
  weekEnd: string;
  status: ReportStatus;
  user: { id: string; name: string };
  project: { id: string; name: string };
}

export interface ActivityRow {
  id: string;
  status: ReportStatus;
  weekStart: string;
  weekEnd: string;
  submittedAt: string | null;
  updatedAt: string;
  user: { id: string; name: string };
  project: { id: string; name: string };
}

export interface TrendPoint {
  week: string;
  reportsSubmitted: number;
  total: number;
}

export interface WorkloadRow {
  projectId: string;
  projectName: string;
  reportCount: number;
  totalHours: number;
}

export interface DashboardFilters {
  week?: string;
  projectId?: string;
  userId?: string;
}
export interface UserSummary {
  id: string;
  name: string;
  email: string;
}