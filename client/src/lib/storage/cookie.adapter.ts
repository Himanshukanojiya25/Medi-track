// src/lib/storage/cookie.adapter.ts

/**
 * 🍪 Cookie Storage Adapter
 * ✅ Universal (Browser + Node.js)
 * ✅ HTTP-only support
 * ✅ Secure flags
 * ✅ SameSite configuration
 * ✅ Domain/path isolation
 * 
 * @example
 * ```typescript
 * const cookieStorage = new CookieAdapter({
 *   domain: '.example.com',
 *   secure: true,
 *   sameSite: 'lax'
 * });
 * ```
 */

// ================ TYPES ================

export interface CookieOptions {
  domain?: string;
  path?: string;
  expires?: Date | number;
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  priority?: 'low' | 'medium' | 'high';
  partitioned?: boolean;
}

export interface CookieConfig {
  domain?: string;
  path?: string;
  defaultOptions?: CookieOptions;
  prefix?: string;
  encode?: (value: string) => string;
  decode?: (value: string) => string;
}

export interface CookieStorageOptions {
  ttl?: number; // in milliseconds
  [key: string]: any;
}

// ================ COOKIE PARSER ================

class CookieParser {
  /**
   * Parse cookie string to object
   */
  static parse(cookieString: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    
    if (!cookieString) return cookies;
    
    cookieString.split(';').forEach(cookie => {
      const [key, value] = cookie.split('=').map(part => part.trim());
      if (key) {
        cookies[key] = decodeURIComponent(value || '');
      }
    });
    
    return cookies;
  }

  /**
   * Stringify cookie object
   */
  static stringify(name: string, value: string, options: CookieOptions = {}): string {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    if (options.maxAge !== undefined) {
      cookie += `; Max-Age=${options.maxAge}`;
    }
    
    if (options.expires) {
      const expires = options.expires instanceof Date 
        ? options.expires 
        : new Date(options.expires);
      cookie += `; Expires=${expires.toUTCString()}`;
    }
    
    if (options.path) {
      cookie += `; Path=${options.path}`;
    }
    
    if (options.domain) {
      cookie += `; Domain=${options.domain}`;
    }
    
    if (options.secure) {
      cookie += '; Secure';
    }
    
    if (options.httpOnly) {
      cookie += '; HttpOnly';
    }
    
    if (options.sameSite) {
      cookie += `; SameSite=${options.sameSite}`;
    }
    
    if (options.priority) {
      cookie += `; Priority=${options.priority}`;
    }
    
    if (options.partitioned) {
      cookie += '; Partitioned';
    }
    
    return cookie;
  }
}

// ================ MAIN COOKIE ADAPTER ================

export class CookieAdapter {
  private config: CookieConfig;
  private isNode: boolean;

  constructor(config: CookieConfig = {}) {
    this.config = {
      path: '/',
      encode: encodeURIComponent,
      decode: decodeURIComponent,
      ...config
    };
    
    this.isNode = typeof window === 'undefined';
  }

  /**
   * Get cookie value
   */
  get<T>(key: string): T | null {
    const fullKey = this.getKey(key);
    
    if (this.isNode) {
      // Node.js environment - parse from request headers
      return this.getNodeCookie(fullKey) as T;
    } else {
      // Browser environment
      const cookies = CookieParser.parse(document.cookie);
      const value = cookies[fullKey];
      
      if (!value) return null;
      
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    }
  }

  /**
   * Set cookie value
   */
  set<T>(key: string, value: T, options?: CookieStorageOptions): void {
    const fullKey = this.getKey(key);
    
    // Serialize value
    const serialized = typeof value === 'string' 
      ? value 
      : JSON.stringify(value);
    
    // Merge options
    const cookieOptions: CookieOptions = {
      ...this.config.defaultOptions,
      path: this.config.path,
      domain: this.config.domain
    };
    
    // Handle TTL
    if (options?.ttl) {
      cookieOptions.maxAge = Math.floor(options.ttl / 1000);
      cookieOptions.expires = Date.now() + options.ttl;
    }
    
    // Handle additional options
    Object.assign(cookieOptions, options);
    
    if (this.isNode) {
      // Node.js - set response cookie
      this.setNodeCookie(fullKey, serialized, cookieOptions);
    } else {
      // Browser
      const cookieString = CookieParser.stringify(
        fullKey, 
        serialized, 
        cookieOptions
      );
      document.cookie = cookieString;
    }
  }

  /**
   * Remove cookie
   */
  remove(key: string): void {
    const fullKey = this.getKey(key);
    
    if (this.isNode) {
      this.setNodeCookie(fullKey, '', { maxAge: 0, expires: new Date(0) });
    } else {
      document.cookie = CookieParser.stringify(fullKey, '', {
        ...this.config.defaultOptions,
        path: this.config.path,
        domain: this.config.domain,
        maxAge: 0,
        expires: new Date(0)
      });
    }
  }

  /**
   * Clear all cookies with prefix
   */
  clear(): void {
    if (this.isNode) {
      // Can't clear all in Node without response object
      return;
    }
    
    const cookies = CookieParser.parse(document.cookie);
    
    Object.keys(cookies).forEach(key => {
      if (!this.config.prefix || key.startsWith(this.config.prefix)) {
        this.remove(key.substring(this.config.prefix?.length || 0));
      }
    });
  }

  /**
   * Get all cookie keys
   */
  keys(): string[] {
    if (this.isNode) {
      return [];
    }
    
    const cookies = CookieParser.parse(document.cookie);
    let keys = Object.keys(cookies);
    
    if (this.config.prefix) {
      keys = keys
        .filter(key => key.startsWith(this.config.prefix!))
        .map(key => key.substring(this.config.prefix!.length));
    }
    
    return keys;
  }

  /**
   * Check if cookie exists
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Get number of cookies
   */
  size(): number {
    if (this.isNode) return 0;
    
    const cookies = CookieParser.parse(document.cookie);
    if (!this.config.prefix) return Object.keys(cookies).length;
    
    return Object.keys(cookies).filter(key => 
      key.startsWith(this.config.prefix!)
    ).length;
  }

  // ================ NODE.JS SUPPORT ================

  private nodeCookies: Record<string, string> = {};
  private nodeResponse: any = null;

  /**
   * Attach to Node.js request/response
   */
  attachToRequest(req: any, res: any): void {
    this.nodeCookies = CookieParser.parse(req.headers.cookie || '');
    this.nodeResponse = res;
    
    // Intercept response to set cookies
    const originalWriteHead = res.writeHead;
    res.writeHead = (...args: any[]) => {
      this.flushCookies();
      return originalWriteHead.apply(res, args);
    };
  }

  private getNodeCookie(key: string): string | null {
    return this.nodeCookies[key] || null;
  }

  private setNodeCookie(key: string, value: string, options: CookieOptions): void {
    if (!this.nodeResponse) return;
    
    const cookieString = CookieParser.stringify(key, value, options);
    
    const existingCookies = this.nodeResponse.getHeader('Set-Cookie') || [];
    const cookies = Array.isArray(existingCookies) 
      ? [...existingCookies, cookieString]
      : [existingCookies, cookieString];
    
    this.nodeResponse.setHeader('Set-Cookie', cookies);
  }

  private flushCookies(): void {
    // Cookies are already set via setHeader
  }

  // ================ UTILITIES ================

  private getKey(key: string): string {
    return this.config.prefix ? `${this.config.prefix}:${key}` : key;
  }

  /**
   * Get all cookies as object
   */
  getAll(): Record<string, any> {
    const result: Record<string, any> = {};
    const keys = this.keys();
    
    keys.forEach(key => {
      result[key] = this.get(key);
    });
    
    return result;
  }

  /**
   * Check if cookies are enabled
   */
  static isEnabled(): boolean {
    if (typeof document === 'undefined') return true; // Node.js
    
    try {
      document.cookie = 'test=1';
      const enabled = document.cookie.includes('test=1');
      document.cookie = 'test=1; max-age=0';
      return enabled;
    } catch {
      return false;
    }
  }
}

// ================ FACTORY FUNCTIONS ================

/**
 * Create cookie storage adapter
 */
export const createCookieAdapter = (config?: CookieConfig): CookieAdapter => {
  return new CookieAdapter(config);
};

/**
 * Create secure cookie adapter (for authentication)
 */
export const createSecureCookieAdapter = (domain?: string): CookieAdapter => {
  return new CookieAdapter({
    domain,
    path: '/',
    defaultOptions: {
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      priority: 'high'
    }
  });
};

export default CookieAdapter;