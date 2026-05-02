import { apiClient } from "@/shared/api/client";
import type {
  AuthResponse,
  LoginRequest,
  Me,
  RegisterRequest,
} from "./auth.types";

export const authApi = {
  me: () => apiClient<Me>("/auth/me"),

  login: (data: LoginRequest) =>
    apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: RegisterRequest) =>
    apiClient<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () => apiClient<null>("/auth/session/logout", { method: "POST" }),

  refresh: () => apiClient<null>("/auth/session/refresh", { method: "POST" }),
};
