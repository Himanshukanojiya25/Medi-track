/**
 * Creates a throttled function
 * - Ensures function runs at most once per interval
 * - Leading execution (default behavior)
 */
export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  intervalMs: number
) {
  if (typeof fn !== "function") {
    throw new Error("throttle expects a function");
  }

  if (!Number.isInteger(intervalMs) || intervalMs <= 0) {
    throw new Error("Invalid interval passed to throttle");
  }

  let lastExecuted = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastExecuted >= intervalMs) {
      lastExecuted = now;
      fn(...args);
    }
  };
}
