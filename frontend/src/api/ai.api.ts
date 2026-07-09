import type { ApiResponse } from "../types";
import apiClient from "./axiosClient";


export const aiChatRequest = (payload: {
  message: string;
  week?: string;
  dateFrom?: string;
  dateTo?: string;
  projectId?: string;
  userId?: string;
}) =>
  apiClient.post<ApiResponse<{ reply: string; reportsUsed: number }>>(
    "/ai/chat",
    payload
  );

export const aiTeamSummaryRequest = (params: {
  week?: string;
  dateFrom?: string;
  dateTo?: string;
  projectId?: string;
}) =>
  apiClient.get<ApiResponse<{ summary: string; reportsUsed: number }>>(
    "/ai/team-summary",
    { params }
  );
