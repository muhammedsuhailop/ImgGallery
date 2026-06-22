import axios from "axios";
import type { ApiErrorResponse } from "@/shared/api/apiTypes";

const FALLBACK = "Something went wrong. Please try again.";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? error.message ?? FALLBACK;
  }
  if (error instanceof Error) {
    return error.message || FALLBACK;
  }
  return FALLBACK;
}
