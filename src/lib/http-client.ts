import { siteConfig } from "@/config/site.config";
import { ApiError } from "@/types/api.types";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip the Authorization header (login/forgot-password/reset-password). */
  unauthenticated?: boolean;
}

/**
 * The single choke point every repository calls through. Repositories never
 * call `fetch` directly and never know whether MSW or a real NestJS instance
 * answers — that's the whole point of the repository pattern (architecture
 * doc §7). Swapping mock -> real is an env var change, not a code change.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, unauthenticated, headers, ...rest } = options;

  const token = unauthenticated ? undefined : getStoredToken();

  const response = await fetch(`${siteConfig.api.baseUrl}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await safeJson(response);
    throw new ApiError(
      errorBody?.message ?? response.statusText,
      errorBody?.code ?? "UNKNOWN_ERROR",
      response.status,
      errorBody?.fieldErrors,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function safeJson(response: Response): Promise<{ message?: string; code?: string; fieldErrors?: Record<string, string[]> } | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Mock-auth token accessor. In "rest" mode this would read from an httpOnly
 * cookie set by the real backend instead — the accessor is the seam.
 */
function getStoredToken(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${siteConfig.session.cookieName}=([^;]*)`));
  return match ? decodeURIComponent(match[1] ?? "") : undefined;
}

export const httpClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "DELETE" }),
};
