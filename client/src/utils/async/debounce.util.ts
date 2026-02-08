/**
 * Creates a debounced function
 * - Ensures function runs only after delay
 * - Supports cancellation
 * - Prevents memory leaks
 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delayMs: number
) {
  if (typeof fn !== "function") {
    throw new Error("debounce expects a function");
  }

  if (!Number.isInteger(delayMs) || delayMs < 0) {
    throw new Error("Invalid delay passed to debounce");
  }

  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delayMs);
  };

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced as T & { cancel: () => void };
}
