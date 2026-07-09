import type { ApiResponse, ReportStatus } from "../types";
import apiClient from "./axiosClient";


export interface ReportFormValues {
  weekStart: string;
  weekEnd: string;
  projectId: string;
  tasksCompleted: string;
  tasksPlanned: string;
  blockers?: string;
  hoursWorked?: number;
  notes?: string;
}

export interface ReportQuery {
  projectId?: string;
  userId?: string;
  status?: ReportStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export const createReportRequest = (payload: ReportFormValues) =>
  apiClient.post<ApiResponse<Report>>("/reports", payload);

export const updateReportRequest = (
  id: string,
  payload: Partial<ReportFormValues>
) => apiClient.put<ApiResponse<Report>>(`/reports/${id}`, payload);

export const submitReportRequest = (id: string) =>
  apiClient.patch<ApiResponse<Report>>(`/reports/${id}/submit`);

export const getReportRequest = (id: string) =>
  apiClient.get<ApiResponse<Report>>(`/reports/${id}`);

export const myReportsRequest = (params: ReportQuery = {}) =>
  apiClient.get<ApiResponse<Report[]>>("/reports/me", { params });

export const allReportsRequest = (params: ReportQuery = {}) =>
  apiClient.get<ApiResponse<Report[]>>("/reports", { params });
