import { api, RetriableRequestConfig } from "@/shared/api/axios";
import type { ApiResponse } from "@/shared/api/apiTypes";
import type {
  AuthUserPayload,
  LoginRequest,
  RegisterRequest,
  RegisteredUserPayload,
} from "@/features/auth/types/auth.types";

class AuthService {
  async login(payload: LoginRequest): Promise<ApiResponse<undefined>> {
    const response = await api.post<ApiResponse<undefined>>(
      "/auth/login",
      payload,
      {
        _skipAuthRefresh: true,
      } as RetriableRequestConfig,
    );
    return response.data;
  }

  async register(
    payload: RegisterRequest,
  ): Promise<ApiResponse<RegisteredUserPayload>> {
    const response = await api.post<ApiResponse<RegisteredUserPayload>>(
      "/auth/register",
      payload,
    );
    return response.data;
  }

  async logout(): Promise<ApiResponse<undefined>> {
    const response = await api.post<ApiResponse<undefined>>("/auth/logout");
    return response.data;
  }

  async getCurrentUser(): Promise<ApiResponse<AuthUserPayload>> {
    const response = await api.get<ApiResponse<AuthUserPayload>>("/auth/me", {
      _skipAuthRefresh: true,
    } as RetriableRequestConfig);
    return response.data;
  }

  async refreshToken(): Promise<ApiResponse<undefined>> {
    const response = await api.post<ApiResponse<undefined>>(
      "/auth/refresh-token",
    );
    return response.data;
  }
}

export const authService = new AuthService();
