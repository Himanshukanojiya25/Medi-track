/**
 * Creates a standard success response object
 */
export function successMessage(
  message: string,
  data?: unknown
): {
  success: true;
  message: string;
  data?: unknown;
} {
  if (typeof message !== "string" || message.trim() === "") {
    throw new Error("successMessage requires a non-empty message");
  }

  return {
    success: true,
    message,
    data,
  };
}
