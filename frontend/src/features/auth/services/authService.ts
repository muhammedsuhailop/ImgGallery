import { api, RetriableRequestConfig } from "@/shared/api/axios";
import type { ApiResponse } from "@/shared/api/apiTypes";
import type {
  AuthUserPayload,
  LoginRequest,
  RegisterRequest,
  RegisteredUserPayload,
  ResetPasswordRequest,
} from "@/features/auth/types/auth.types";
import { ApiEndpoints } from "@/shared/constants/apiEndpoints";

class AuthService {
  async login(payload: LoginRequest): Promise<ApiResponse<undefined>> {
    const response = await api.post<ApiResponse<undefined>>(
      ApiEndpoints.LOGIN,
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
      ApiEndpoints.REGISTER,
      payload,
    );
    return response.data;
  }

  async logout(): Promise<ApiResponse<undefined>> {
    const response = await api.post<ApiResponse<undefined>>(
      ApiEndpoints.LOGOUT,
    );
    return response.data;
  }

  async getCurrentUser(): Promise<ApiResponse<AuthUserPayload>> {
    const response = await api.get<ApiResponse<AuthUserPayload>>(
      ApiEndpoints.GET_CURRENT_USER,
      {
        _skipAuthRefresh: true,
      } as RetriableRequestConfig,
    );
    return response.data;
  }

  async refreshToken(): Promise<ApiResponse<undefined>> {
    const response = await api.post<ApiResponse<undefined>>(
      ApiEndpoints.REFRESH_TOKEN,
    );
    return response.data;
  }

  async resetPassword(
    payload: ResetPasswordRequest,
  ): Promise<ApiResponse<undefined>> {
    const response = await api.patch<ApiResponse<undefined>>(
      ApiEndpoints.RESET_PASSWORD,
      payload,
    );
    return response.data;
  }
}

export const authService = new AuthService();
