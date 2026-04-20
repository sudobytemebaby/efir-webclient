import { apiClient } from "@/shared/api/client";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/features/auth/auth.types";

export const authApi = {
  me: () => apiClient<{ user_id: string }>("/auth/me"),

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

  logout: () => apiClient<null>("/auth/logout", { method: "POST" }),
};
