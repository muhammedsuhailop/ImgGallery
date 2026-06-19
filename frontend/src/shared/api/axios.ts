import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { env } from "@/shared/config/env";
import type { ApiErrorResponse } from "./apiTypes";

export interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _skipAuthRefresh?: boolean;
}

export const api: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => config);

let refreshPromise: Promise<void> | null = null;

async function refreshSession(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${env.apiUrl}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
        },
      )
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }

  await refreshPromise;
}

const AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/logout",
  "/auth/me",
  "/auth/refresh-token",
];

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    const requestUrl = originalRequest?.url ?? "";

    const isAuthRequest = AUTH_ENDPOINTS.some((endpoint) =>
      requestUrl.includes(endpoint),
    );

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest._skipAuthRefresh &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;

      try {
        await refreshSession();

        return api(originalRequest);
      } catch {
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;

          if (currentPath !== "/login" && currentPath !== "/register") {
            window.location.replace("/login");
          }
        }

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export type { AxiosError };
