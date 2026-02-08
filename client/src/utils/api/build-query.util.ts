/**
 * Builds a URL query string from an object
 * - Skips undefined / null values
 * - Stable & deterministic
 * - Encodes values safely
 */
export function buildQuery(
  params: Record<string, unknown>
): string {
  if (params === null || typeof params !== "object") {
    throw new Error("buildQuery expects an object");
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    // Arrays → repeated params (?a=1&a=2)
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== undefined && v !== null) {
          searchParams.append(key, String(v));
        }
      });
      return;
    }

    searchParams.append(key, String(value));
  });

  return searchParams.toString();
}
