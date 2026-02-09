// src/services/api/api.error-handler.ts
import { AxiosError } from "axios";
import { ApiError } from "./api.types";

export function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    return {
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
      statusCode: error.response?.status,
    };
  }

  return {
    message: "Unexpected error occurred",
  };
}
