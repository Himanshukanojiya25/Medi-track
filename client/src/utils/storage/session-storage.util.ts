/**
 * Safe wrapper around sessionStorage
 * - Same guarantees as localStorageUtil
 */
export const sessionStorageUtil = {
  isAvailable(): boolean {
    try {
      return (
        typeof window !== "undefined" &&
        typeof window.sessionStorage !== "undefined"
      );
    } catch {
      return false;
    }
  },

  get<T>(key: string): T | null {
    if (!this.isAvailable()) return null;

    try {
      const raw = window.sessionStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) return false;

    try {
      window.sessionStorage.setItem(
        key,
        JSON.stringify(value)
      );
      return true;
    } catch {
      return false;
    }
  },

  remove(key: string): boolean {
    if (!this.isAvailable()) return false;

    try {
      window.sessionStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear(): boolean {
    if (!this.isAvailable()) return false;

    try {
      window.sessionStorage.clear();
      return true;
    } catch {
      return false;
    }
  },
};
