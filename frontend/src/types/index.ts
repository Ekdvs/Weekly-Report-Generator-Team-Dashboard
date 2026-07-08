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