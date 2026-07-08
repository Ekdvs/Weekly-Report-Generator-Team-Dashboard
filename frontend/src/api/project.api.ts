import type { ApiResponse, Project } from "../types";
import apiClient from "./axiosClient";

export const listProjectsRequest = () =>
  apiClient.get<ApiResponse<Project[]>>("/projects");

export const getProjectRequest = (id: string) =>
  apiClient.get<ApiResponse<Project>>(`/projects/${id}`);

export const createProjectRequest = (payload: {
  name: string;
  description?: string;
}) => apiClient.post<ApiResponse<Project>>("/projects", payload);

export const updateProjectRequest = (
  id: string,
  payload: { name?: string; description?: string }
) => apiClient.put<ApiResponse<Project>>(`/projects/${id}`, payload);

export const deleteProjectRequest = (id: string) =>
  apiClient.delete<ApiResponse<{ id: string }>>(`/projects/${id}`);

export const assignMemberRequest = (projectId: string, userId: string) =>
  apiClient.post<ApiResponse<Project>>(`/projects/${projectId}/members`, {
    userId,
  });

export const removeMemberRequest = (projectId: string, userId: string) =>
  apiClient.delete<ApiResponse<Project>>(
    `/projects/${projectId}/members/${userId}`
  );
