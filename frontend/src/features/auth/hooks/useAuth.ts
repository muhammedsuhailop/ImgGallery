import { useAppSelector } from "@/app/store/hooks";
import {
  selectAuthError,
  selectAuthInitialized,
  selectAuthLoading,
  selectAuthUser,
  selectIsAuthenticated,
} from "@/features/auth/store/authSelectors";
import type { User } from "@/features/auth/types/user.types";

export interface UseAuthResult {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialized: boolean;
  error: string | null;
}

export function useAuth(): UseAuthResult {
  const user = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const initialized = useAppSelector(selectAuthInitialized);
  const error = useAppSelector(selectAuthError);

  return { user, isAuthenticated, isLoading, initialized, error };
}
