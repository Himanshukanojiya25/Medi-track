/**
 * Runtime assertion utility
 * Throws predictable error instead of silent failure
 */
export function assert(
  condition: unknown,
  message = "Assertion failed"
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
