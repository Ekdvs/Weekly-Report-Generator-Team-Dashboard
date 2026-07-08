import type { ApiResponse, AuthUser, Role } from "../types";
import apiClient from "./axiosClient";

interface AuthResult {
  token: string;
  user: AuthUser;
}

export const registerRequest = (payload: {
  name: string;
  email: string;
  password: string;
  role: Role;
}) => apiClient.post<ApiResponse<AuthResult>>("/auth/register", payload);

export const loginRequest = (payload: { email: string; password: string }) =>
  apiClient.post<ApiResponse<AuthResult>>("/auth/login", payload);

export const logoutRequest = () => apiClient.post("/auth/logout");

export const meRequest = () => apiClient.get<ApiResponse<AuthUser>>("/auth/me");
