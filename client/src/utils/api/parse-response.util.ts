/**
 * Parses API response data
 * - Central place to cast / normalize
 * - No runtime transformation here (yet)
 */
export function parseResponse<T>(data: unknown): T {
  if (data === undefined) {
    throw new Error("parseResponse received undefined data");
  }

  return data as T;
}
