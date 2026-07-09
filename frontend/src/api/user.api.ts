import type { ApiResponse, Role, User } from "../types";
import apiClient from "./axiosClient";


export const listUsersRequest = (role?: Role) =>
  apiClient.get<ApiResponse<User[]>>("/users", { params: role ? { role } : {} });

export const updateUserRoleRequest = (id: string, role: Role) =>
  apiClient.patch<ApiResponse<User>>(`/users/${id}/role`, { role });
