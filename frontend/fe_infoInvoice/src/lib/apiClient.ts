const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
import { getToken } from "../utils/token";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type QueryParams = object;

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  params?: QueryParams;
}

export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers = {}, params } = options;
  const token = getToken();

  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const defined = Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null,
    );
    if (defined.length > 0) {
      const qs = new URLSearchParams(
        defined.map(([k, v]) => [k, String(v)]),
      ).toString();
      url += `?${qs}`;
    }
  }

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Nếu server trả lỗi, parse message từ body rồi throw ApiError
  if (!response.ok) {
    let message = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errData = await response.json();
      if (errData?.message) message = errData.message;
    } catch {
      // Bỏ qua nếu body không phải JSON
    }
    throw new ApiError(response.status, message);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(endpoint: string, params?: QueryParams) =>
    request<T>(endpoint, { method: "GET", params }),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "POST", body }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "PUT", body }),

  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "PATCH", body }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
