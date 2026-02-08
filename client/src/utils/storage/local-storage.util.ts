/**
 * Safe wrapper around localStorage
 * - SSR safe
 * - JSON safe
 * - Never throws on quota / access errors
 */
export const localStorageUtil = {
  isAvailable(): boolean {
    try {
      return (
        typeof window !== "undefined" &&
        typeof window.localStorage !== "undefined"
      );
    } catch {
      return false;
    }
  },

  get<T>(key: string): T | null {
    if (!this.isAvailable()) return null;

    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) return false;

    try {
      window.localStorage.setItem(
        key,
        JSON.stringify(value)
      );
      return true;
    } catch {
      // quota exceeded / blocked
      return false;
    }
  },

  remove(key: string): boolean {
    if (!this.isAvailable()) return false;

    try {
      window.localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear(): boolean {
    if (!this.isAvailable()) return false;

    try {
      window.localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },
};
