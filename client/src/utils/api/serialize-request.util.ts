/**
 * Serializes a request payload safely
 * - Removes undefined values
 * - Ensures JSON-safe structure
 */
export function serializeRequest<T>(payload: T): T {
  if (payload === undefined) {
    throw new Error("serializeRequest received undefined payload");
  }

  return JSON.parse(
    JSON.stringify(payload, (_key, value) =>
      value === undefined ? undefined : value
    )
  );
}
