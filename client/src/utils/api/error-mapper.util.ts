/**
 * Normalizes API errors into a predictable shape
 * - Never throws
 * - Safe to show in UI or logs
 */
export function mapApiError(error: unknown): {
  message: string;
  code: string;
} {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    return {
      message: String((error as any).message),
      code: String((error as any).code ?? "API_ERROR"),
    };
  }

  return {
    message: "Unexpected API error",
    code: "API_ERROR",
  };
}
