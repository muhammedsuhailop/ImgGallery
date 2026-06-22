import type { RootState } from "@/app/store/store";
import type { User } from "@/features/auth/types/user.types";

export const selectAuthUser = (state: RootState): User | null =>
  state.auth.user;
export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState): boolean =>
  state.auth.isLoading;
export const selectAuthInitialized = (state: RootState): boolean =>
  state.auth.initialized;
export const selectAuthError = (state: RootState): string | null =>
  state.auth.error;
