import { env } from "@/shared/config/env";

export class ApiError extends Error {
  status: number;
  body: { error: string; code: string };

  constructor(status: number, body: { error: string; code: string }) {
    super(body.error);
    this.status = status;
    this.body = body;
  }
}

let refreshPromise: Promise<void> | null = null;

async function refreshToken(): Promise<void> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = fetch(`${env.apiUrl}/auth/session/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok)
        throw new ApiError(res.status, {
          error: "refresh failed",
          code: "UNAUTHORIZED",
        });
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${env.apiUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (res.status === 401) {
    try {
      await refreshToken();
      const retryRes = await fetch(`${env.apiUrl}${path}`, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
      if (!retryRes.ok)
        throw new ApiError(retryRes.status, await retryRes.json());
      if (retryRes.status === 204) return null as T;
      return retryRes.json();
    } catch {
      window.location.href = "/login";
      throw new Error("session expired");
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, await res.json());
  }

  if (res.status === 204) return null as T;
  return res.json();
}
