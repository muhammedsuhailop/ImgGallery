import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { env } from "@/shared/config/env";
import type { ApiErrorResponse } from "./apiTypes";
import { ApiEndpoints } from "@/shared/constants/apiEndpoints";
import { HttpStatus } from "../constants/httpStatusCodes";

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

api.interceptors.request.use((config) => {
  console.log(
    `[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
  );

  return config;
});

let refreshPromise: Promise<AxiosResponse<unknown>> | null = null;

async function refreshSession(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = axios.post<unknown>(
      `${env.apiUrl}${ApiEndpoints.REFRESH_TOKEN}`,
      {},
      {
        withCredentials: true,
      },
    );
  } else {
    console.log("[Auth] Waiting for existing refresh request");
  }

  try {
    await refreshPromise;
  } catch (error) {
    console.error("[Auth] Refresh failed", error);

    throw error;
  } finally {
    refreshPromise = null;
  }
}

const AUTH_ENDPOINTS = [
  ApiEndpoints.LOGIN,
  ApiEndpoints.REGISTER,
  ApiEndpoints.LOGOUT,
  ApiEndpoints.REFRESH_TOKEN,
];

api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    const requestUrl = originalRequest?.url ?? "";

    const isAuthRequest = AUTH_ENDPOINTS.some(
      (endpoint) => requestUrl.endsWith(endpoint) || requestUrl === endpoint,
    );

    const shouldRefresh =
      error.response?.status === HttpStatus.UNAUTHORIZED &&
      Boolean(originalRequest) &&
      !originalRequest?._retry &&
      !originalRequest?._skipAuthRefresh &&
      !isAuthRequest;

    if (shouldRefresh && originalRequest) {
      originalRequest._retry = true;

      try {
        await refreshSession();

        return api(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;

          if (currentPath !== "/login" && currentPath !== "/register") {
            window.location.replace("/login");
          }
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export type { AxiosError };
