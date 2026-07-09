import type { ActivityRow, ApiResponse, BlockerRow, DashboardFilters, DashboardSummary, SubmissionStatusRow, TrendPoint, WorkloadRow } from "../types";
import apiClient from "./axiosClient";


export const getSummaryRequest = (params: DashboardFilters = {}) =>
  apiClient.get<ApiResponse<DashboardSummary>>("/dashboard/summary", {
    params,
  });

export const getSubmissionStatusRequest = (params: DashboardFilters = {}) =>
  apiClient.get<ApiResponse<SubmissionStatusRow[]>>(
    "/dashboard/submission-status",
    { params }
  );

export const getOpenBlockersRequest = (params: DashboardFilters = {}) =>
  apiClient.get<ApiResponse<BlockerRow[]>>("/dashboard/open-blockers", {
    params,
  });

export const getRecentActivityRequest = (params: DashboardFilters = {}) =>
  apiClient.get<ApiResponse<ActivityRow[]>>("/dashboard/recent-activity", {
    params,
  });

export const getTasksTrendRequest = (
  params: { weeks?: number; projectId?: string; userId?: string } = {}
) =>
  apiClient.get<ApiResponse<TrendPoint[]>>("/dashboard/tasks-trend", {
    params,
  });

export const getWorkloadByProjectRequest = (
  params: { dateFrom?: string; dateTo?: string; userId?: string } = {}
) =>
  apiClient.get<ApiResponse<WorkloadRow[]>>(
    "/dashboard/workload-by-project",
    { params }
  );
