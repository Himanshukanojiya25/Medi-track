/**
 * Normalizes any error into a predictable shape
 * - Never throws
 * - Safe for UI + logging
 */
export function normalizeError(error: unknown): {
  message: string;
  code: string;
  details?: unknown;
} {
  // Known error object
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    const err = error as any;

    return {
      message: String(err.message),
      code: String(err.code ?? "ERROR"),
      details: err.details,
    };
  }

  // String error
  if (typeof error === "string") {
    return {
      message: error,
      code: "ERROR",
    };
  }

  // Fallback
  return {
    message: "Something went wrong",
    code: "UNKNOWN_ERROR",
  };
}
