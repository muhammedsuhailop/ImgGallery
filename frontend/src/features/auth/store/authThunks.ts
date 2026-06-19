import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@/features/auth/services/authService";
import type {
  LoginRequest,
  RegisterRequest,
} from "@/features/auth/types/auth.types";
import type { RegisteredUser, User } from "@/features/auth/types/user.types";
import { getErrorMessage } from "@/utils/getErrorMessage";

export interface ThunkApiConfig {
  rejectValue: string;
}

export const loginThunk = createAsyncThunk<User, LoginRequest, ThunkApiConfig>(
  "auth/login",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      await authService.login(payload);
      const me = await authService.getCurrentUser();
      if (!me.data?.user) {
        return rejectWithValue("Failed to load user profile.");
      }
      return me.data.user;
    } catch (error) {
      void dispatch;
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const registerThunk = createAsyncThunk<
  RegisteredUser,
  RegisterRequest,
  ThunkApiConfig
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const response = await authService.register(payload);
    if (!response.data?.user) {
      return rejectWithValue("Registration response was malformed.");
    }
    return response.data.user;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const logoutThunk = createAsyncThunk<void, void, ThunkApiConfig>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getCurrentUserThunk = createAsyncThunk<User, void, ThunkApiConfig>(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      if (!response.data?.user) {
        return rejectWithValue("User profile unavailable.");
      }
      return response.data.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const initializeAuthThunk = createAsyncThunk<
  User | null,
  void,
  ThunkApiConfig
>("auth/initialize", async (_, { rejectWithValue }) => {
  try {
    const response = await authService.getCurrentUser();
    return response.data?.user ?? null;
  } catch (error) {
    void getErrorMessage(error);
    void rejectWithValue;
    return null;
  }
});
