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

async function parseResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) return null as T;

  if (!res.ok) {
    const body = await res.json().catch(() => ({
      error: res.statusText,
      code: "UNKNOWN",
    }));
    throw new ApiError(res.status, body);
  }

  return res.json();
}

function buildRequest(path: string, options: RequestInit = {}): Request {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return new Request(`${env.apiUrl}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const request = buildRequest(path, options);
  const res = await fetch(request.clone());

  if (res.status === 401) {
    try {
      await refreshToken();
    } catch (e) {
      throw e instanceof ApiError
        ? e
        : new ApiError(401, { error: "session expired", code: "UNAUTHORIZED" });
    }

    return parseResponse<T>(await fetch(buildRequest(path, options)));
  }

  return parseResponse<T>(res);
}
