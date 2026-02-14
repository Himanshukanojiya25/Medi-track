// src/utils/logger.util.ts

/**
 * 🎯 Enterprise-Grade Logger Utility
 * ✅ Zero dependencies
 * ✅ Works in Browser & Node.js
 * ✅ Type-safe
 * ✅ Production-ready for millions of users
 */

// ================ TYPES ================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  userId?: string;
  sessionId?: string;
  requestId?: string;
  environment: string;
  version: string;
}

export interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteUrl?: string;
  batchSize: number;
  flushInterval: number;
  sampling?: {
    enabled: boolean;
    rate: number;
  };
  maskFields: string[];
}

// ================ ENVIRONMENT DETECTION ================

const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};

const isNode = (): boolean => {
  // Check if we're in a non-browser environment
  // Use globalThis instead of global (works everywhere)
  return !isBrowser() && typeof globalThis !== 'undefined' && typeof (globalThis as any).process !== 'undefined';
};

// ✅ FIXED: Safe environment variable access
const getEnvVariable = (key: string, defaultValue: string = ''): string => {
  // 1. Try browser environment
  if (isBrowser()) {
    // Check window.__ENV__ (injected by build tools)
    try {
      const env = (window as any).__ENV__;
      if (env && typeof env === 'object' && key in env) {
        return String(env[key]);
      }
    } catch {
      // Continue to next check
    }

    // Check data attributes on script tag
    try {
      const scriptTag = document.querySelector('script[data-env]');
      if (scriptTag) {
        const envData = scriptTag.getAttribute(`data-${key.toLowerCase()}`);
        if (envData) return envData;
      }
    } catch {
      // Continue
    }

    return defaultValue;
  }

  // 2. Try Node.js environment
  if (isNode()) {
    // Try process.env (available in Node.js)
    try {
      // Use globalThis to safely access process
      const proc = (globalThis as any).process;
      if (proc && proc.env && typeof proc.env === 'object') {
        const value = proc.env[key];
        return value ? String(value) : defaultValue;
      }
    } catch {
      // Not in Node.js or access restricted
    }

    // Try import.meta.env (Vite)
    try {
      if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
        const value = (import.meta as any).env[key];
        if (value !== undefined) return String(value);
      }
    } catch {
      // Not in Vite environment
    }

    return defaultValue;
  }

  return defaultValue;
};

// ✅ FIXED: Safe fetch availability check
const hasFetch = (): boolean => {
  return typeof fetch === 'function';
};

// ================ MAIN LOGGER CLASS ================

class Logger {
  private static instance: Logger;
  private config: LoggerConfig;
  private logQueue: LogEntry[] = [];
  private flushTimerId: number | null = null; // Browser-compatible timer
  private sessionId: string;
  private currentUserId: string = '';
  private currentRequestId: string = '';
  private readonly DEFAULT_BATCH_SIZE = 50;
  private readonly DEFAULT_FLUSH_INTERVAL = 5000;
  private readonly MAX_QUEUE_SIZE = 1000;
  private isShuttingDown = false;

  private constructor() {
    this.config = this.loadConfig();
    this.sessionId = this.generateId();
    this.setupFlushInterval();
    this.setupGlobalHandlers();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private loadConfig(): LoggerConfig {
    const nodeEnv = getEnvVariable('NODE_ENV', 'development');
    const appVersion = getEnvVariable('APP_VERSION', '1.0.0');
    const logLevel = getEnvVariable('LOG_LEVEL', 'info') as LogLevel;
    const logEndpoint = getEnvVariable('LOG_ENDPOINT', '/api/logs');
    const samplingEnabled = getEnvVariable('LOG_SAMPLING', 'false') === 'true';
    const samplingRate = parseFloat(getEnvVariable('LOG_SAMPLING_RATE', '0.1'));

    // ✅ Store config in window for debugging (only in dev)
    if (isBrowser() && nodeEnv === 'development') {
      try {
        (window as any).__LOGGER_CONFIG__ = {
          nodeEnv,
          appVersion,
          logLevel,
          logEndpoint
        };
      } catch {
        // Ignore if can't set
      }
    }

    return {
      minLevel: logLevel,
      enableConsole: nodeEnv !== 'production' || getEnvVariable('LOG_CONSOLE', 'false') === 'true',
      enableRemote: nodeEnv === 'production' && hasFetch(),
      remoteUrl: logEndpoint,
      batchSize: parseInt(getEnvVariable('LOG_BATCH_SIZE', '50'), 10),
      flushInterval: parseInt(getEnvVariable('LOG_FLUSH_INTERVAL', '5000'), 10),
      sampling: {
        enabled: samplingEnabled,
        rate: Math.min(Math.max(samplingRate, 0), 1) // Clamp between 0-1
      },
      maskFields: [
        'password',
        'token',
        'secret',
        'authorization',
        'apiKey',
        'api_key',
        'creditCard',
        'credit_card',
        'cvv',
        'otp',
        'ssn',
        'privateKey',
        'accessToken',
        'refreshToken'
      ]
    };
  }

  private getEnvironment(): string {
    return getEnvVariable('NODE_ENV', 'development');
  }

  private getVersion(): string {
    return getEnvVariable('APP_VERSION', '1.0.0');
  }

  // ================ PUBLIC API ================

  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, any>): void;
  error(message: string, error: Error | unknown, context?: Record<string, any>): void;
  error(message: string, errorOrContext?: Error | unknown | Record<string, any>, context?: Record<string, any>): void {
    // ✅ FIXED: Proper overload handling
    let finalError: Error | unknown | undefined;
    let finalContext: Record<string, any> | undefined;

    if (errorOrContext instanceof Error || (errorOrContext && typeof errorOrContext === 'object' && 'message' in errorOrContext)) {
      finalError = errorOrContext;
      finalContext = context;
    } else if (typeof errorOrContext === 'object') {
      finalContext = errorOrContext as Record<string, any>;
    }

    const errorObj = finalError ? this.normalizeError(finalError) : undefined;
    this.log('error', message, { ...finalContext, ...(errorObj ? { error: errorObj } : {}) });
  }

  fatal(message: string, context?: Record<string, any>): void;
  fatal(message: string, error: Error | unknown, context?: Record<string, any>): void;
  fatal(message: string, errorOrContext?: Error | unknown | Record<string, any>, context?: Record<string, any>): void {
    // ✅ FIXED: Proper overload handling
    let finalError: Error | unknown | undefined;
    let finalContext: Record<string, any> | undefined;

    if (errorOrContext instanceof Error || (errorOrContext && typeof errorOrContext === 'object' && 'message' in errorOrContext)) {
      finalError = errorOrContext;
      finalContext = context;
    } else if (typeof errorOrContext === 'object') {
      finalContext = errorOrContext as Record<string, any>;
    }

    const errorObj = finalError ? this.normalizeError(finalError) : undefined;
    this.log('fatal', message, { ...finalContext, ...(errorObj ? { error: errorObj } : {}) });
    this.flushNow();
  }

  setUserId(userId: string): void {
    this.currentUserId = userId;
  }

  setRequestId(requestId: string): void {
    this.currentRequestId = requestId;
  }

  clearUserId(): void {
    this.currentUserId = '';
  }

  clearRequestId(): void {
    this.currentRequestId = '';
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getConfig(): Readonly<LoggerConfig> {
    return { ...this.config };
  }

  updateConfig(updates: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...updates };
    
    // Restart flush interval if it changed
    if (updates.flushInterval !== undefined) {
      this.setupFlushInterval();
    }
  }

  child(moduleContext: Record<string, any>): Logger {
    const childLogger = Object.create(this) as Logger;
    const originalLog = this.log.bind(this);
    
    childLogger.log = (level: LogLevel, message: string, context?: Record<string, any>) => {
      const mergedContext = { ...moduleContext, ...context };
      originalLog(level, message, mergedContext);
    };
    
    return childLogger;
  }

  time(label: string): void {
    if (!this.config.enableConsole) return;
    
    try {
      console.time(label);
    } catch {
      // console.time not available
    }
  }

  timeEnd(label: string): void {
    if (!this.config.enableConsole) return;
    
    try {
      console.timeEnd(label);
    } catch {
      // console.timeEnd not available
    }
  }

  group(label: string): void {
    if (!this.config.enableConsole) return;
    
    try {
      if (typeof console.group === 'function') {
        console.group(label);
      } else {
        console.log(`--- ${label} ---`);
      }
    } catch {
      // console.group not available
    }
  }

  groupEnd(): void {
    if (!this.config.enableConsole) return;
    
    try {
      if (typeof console.groupEnd === 'function') {
        console.groupEnd();
      }
    } catch {
      // console.groupEnd not available
    }
  }

  getQueueSize(): number {
    return this.logQueue.length;
  }

  clearQueue(): void {
    this.logQueue = [];
  }

  // ✅ NEW: Graceful shutdown for server environments
  async shutdown(): Promise<void> {
    this.isShuttingDown = true;
    
    // Clear flush interval
    if (this.flushTimerId !== null) {
      clearInterval(this.flushTimerId);
      this.flushTimerId = null;
    }

    // Flush remaining logs
    await this.flush();
  }

  // ================ PRIVATE METHODS ================

  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (this.isShuttingDown) return;
    if (!this.shouldLog(level)) return;

    // ✅ Sampling for high-volume scenarios
    if (this.config.sampling?.enabled && level !== 'error' && level !== 'fatal') {
      if (Math.random() > this.config.sampling.rate) {
        return;
      }
    }

    const entry = this.createEntry(level, message, context);
    this.maskSensitiveData(entry);

    if (this.config.enableConsole) {
      this.writeToConsole(entry);
    }

    if (this.config.enableRemote) {
      this.queueForRemote(entry);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];
    const minIndex = levels.indexOf(this.config.minLevel);
    const currentIndex = levels.indexOf(level);
    return currentIndex >= minIndex;
  }

  private createEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: context || {},
      sessionId: this.sessionId,
      environment: this.getEnvironment(),
      version: this.getVersion()
    };

    if (this.currentUserId) {
      entry.userId = this.currentUserId;
    }

    if (this.currentRequestId) {
      entry.requestId = this.currentRequestId;
    }

    return entry;
  }

  private normalizeError(error: unknown): { name: string; message: string; stack?: string } {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    }
    
    if (error && typeof error === 'object') {
      const err = error as any;
      return {
        name: err.name || 'Error',
        message: err.message || JSON.stringify(error),
        stack: err.stack
      };
    }
    
    return {
      name: 'UnknownError',
      message: String(error)
    };
  }

  private maskSensitiveData(entry: LogEntry): void {
    if (!this.config.maskFields.length) return;

    const maskValue = '***MASKED***';

    const maskObject = (obj: any, depth = 0): any => {
      // ✅ Prevent infinite recursion
      if (depth > 10) return '[MAX_DEPTH]';
      if (!obj || typeof obj !== 'object') return obj;
      
      // ✅ Handle circular references
      try {
        if (Array.isArray(obj)) {
          return obj.map(item => maskObject(item, depth + 1));
        }

        const result: any = {};
        
        for (const key of Object.keys(obj)) {
          const lowerKey = key.toLowerCase();
          const shouldMask = this.config.maskFields.some(field => 
            lowerKey.includes(field.toLowerCase())
          );
          
          if (shouldMask) {
            result[key] = maskValue;
          } else if (obj[key] && typeof obj[key] === 'object') {
            result[key] = maskObject(obj[key], depth + 1);
          } else {
            result[key] = obj[key];
          }
        }
        
        return result;
      } catch {
        return '[CIRCULAR]';
      }
    };

    if (entry.context) {
      entry.context = maskObject(entry.context);
    }
    
    if (entry.error) {
      entry.error = maskObject(entry.error);
    }
  }

  private writeToConsole(entry: LogEntry): void {
    const { level, message, context } = entry;
    
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    const hasContext = context && Object.keys(context).length > 0;

    // ✅ Map log levels to console methods (fatal -> error)
    const consoleMethodMap: Record<LogLevel, keyof Console> = {
      debug: 'debug',
      info: 'info',
      warn: 'warn',
      error: 'error',
      fatal: 'error' // fatal maps to console.error
    };

    const consoleMethodName = consoleMethodMap[level];
    const consoleMethod = console[consoleMethodName] as (...args: any[]) => void;

    // ✅ Better console styling for browser
    if (isBrowser()) {
      const styles: Record<LogLevel, string> = {
        debug: 'color: #6c757d;',
        info: 'color: #0d6efd; font-weight: 500;',
        warn: 'color: #ffc107; font-weight: bold;',
        error: 'color: #dc3545; font-weight: bold;',
        fatal: 'color: #fff; font-weight: bold; background: #dc3545; padding: 2px 6px; border-radius: 3px;'
      };

      const style = styles[level] || styles.info;
      
      try {
        if (hasContext) {
          consoleMethod(`%c${prefix} ${message}`, style, context);
        } else {
          consoleMethod(`%c${prefix} ${message}`, style);
        }
      } catch {
        // Fallback to plain console.log
        console.log(`${prefix} ${message}`, hasContext ? context : '');
      }
    } else {
      // Node.js - no styling
      try {
        if (hasContext) {
          consoleMethod(`${prefix} ${message}`, context);
        } else {
          consoleMethod(`${prefix} ${message}`);
        }
      } catch {
        // Fallback to plain console.log
        console.log(`${prefix} ${message}`, hasContext ? context : '');
      }
    }
  }

  private queueForRemote(entry: LogEntry): void {
    // ✅ Prevent queue overflow
    if (this.logQueue.length >= this.MAX_QUEUE_SIZE) {
      // Drop oldest entries when queue is full
      this.logQueue.shift();
    }

    this.logQueue.push(entry);

    // ✅ Auto-flush on batch size or critical errors
    const shouldFlushImmediately = 
      this.logQueue.length >= (this.config.batchSize || this.DEFAULT_BATCH_SIZE) ||
      entry.level === 'fatal';

    if (shouldFlushImmediately) {
      this.flush();
    }
  }

  private setupFlushInterval(): void {
    if (this.flushTimerId !== null) {
      clearInterval(this.flushTimerId);
    }

    const interval = this.config.flushInterval || this.DEFAULT_FLUSH_INTERVAL;
    
    this.flushTimerId = setInterval(() => {
      this.flush();
    }, interval) as unknown as number; // Cast to number for browser compatibility
  }

  private async flush(): Promise<void> {
    if (this.logQueue.length === 0 || !this.config.enableRemote || !this.config.remoteUrl) {
      return;
    }

    if (!hasFetch()) {
      // ✅ Fetch not available, skip remote logging
      this.logQueue = [];
      return;
    }

    const batch = this.logQueue.splice(0, this.config.batchSize || this.DEFAULT_BATCH_SIZE);

    try {
      await this.sendToServer(batch);
    } catch (error) {
      // ✅ On failure, re-queue up to MAX_QUEUE_SIZE
      const remaining = [...batch, ...this.logQueue].slice(0, this.MAX_QUEUE_SIZE);
      this.logQueue = remaining;
      
      // Only log in development
      if (this.getEnvironment() === 'development') {
        console.warn('[Logger] Failed to send logs:', error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }

  private flushNow(): void {
    if (this.logQueue.length === 0 || !this.config.remoteUrl || !hasFetch()) {
      return;
    }

    const batch = [...this.logQueue];
    this.logQueue = [];

    // ✅ Use sendBeacon for page unload scenarios
    if (isBrowser() && typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      try {
        const blob = new Blob([JSON.stringify({ logs: batch })], { 
          type: 'application/json' 
        });
        const sent = navigator.sendBeacon(this.config.remoteUrl, blob);
        
        if (!sent && this.getEnvironment() === 'development') {
          console.warn('[Logger] sendBeacon failed, logs may be lost');
        }
      } catch (error) {
        // Silent fail - we're likely shutting down anyway
      }
    } else {
      // Fallback to async send (may not complete if page is unloading)
      this.sendToServer(batch).catch(() => {
        // Silent fail
      });
    }
  }

  private async sendToServer(entries: LogEntry[]): Promise<void> {
    if (!this.config.remoteUrl || !hasFetch()) {
      throw new Error('Fetch API not available');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(this.config.remoteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs: entries,
          source: isBrowser() ? 'browser' : 'node',
          timestamp: new Date().toISOString()
        }),
        signal: controller.signal,
        keepalive: isBrowser() // Only use keepalive in browser
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Log upload timed out');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private setupGlobalHandlers(): void {
    if (!isBrowser()) return;

    try {
      // ✅ Unhandled errors
      window.addEventListener('error', (event) => {
        this.error('Unhandled error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error
        });
      });

      // ✅ Unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.error('Unhandled promise rejection', {
          reason: event.reason
        });
      });

      // ✅ Page unload - flush logs
      window.addEventListener('beforeunload', () => {
        this.flushNow();
      });

      // ✅ Tab visibility - flush when hidden
      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') {
            this.flushNow();
          }
        });
      }

      // ✅ Pagehide event (more reliable for mobile)
      window.addEventListener('pagehide', () => {
        this.flushNow();
      });
    } catch (error) {
      // Failed to setup handlers, continue without them
    }
  }

  private generateId(): string {
    // ✅ More robust ID generation
    const timestamp = Date.now().toString(36);
    const random1 = Math.random().toString(36).substring(2, 11);
    const random2 = Math.random().toString(36).substring(2, 11);
    const performance = isBrowser() && window.performance ? 
      window.performance.now().toString(36).substring(0, 6) : 
      Math.random().toString(36).substring(2, 8);
    
    return `${timestamp}-${random1}-${random2}-${performance}`;
  }
}

// ================ EXPORTS ================

export const logger = Logger.getInstance();

export const createLogger = (context?: Record<string, any>): Logger => {
  const instance = Logger.getInstance();
  return context ? instance.child(context) : instance;
};

export type { Logger as LoggerType };

// ================ CONVENIENCE EXPORTS ================

export const log = {
  debug: (message: string, context?: Record<string, any>) => logger.debug(message, context),
  info: (message: string, context?: Record<string, any>) => logger.info(message, context),
  warn: (message: string, context?: Record<string, any>) => logger.warn(message, context),
  error: (message: string, errorOrContext?: any, context?: Record<string, any>) => {
    logger.error(message, errorOrContext, context);
  },
  fatal: (message: string, errorOrContext?: any, context?: Record<string, any>) => {
    logger.fatal(message, errorOrContext, context);
  }
};

// ================ GLOBAL TYPES ================

declare global {
  interface Window {
    __ENV__?: Record<string, string>;
    __LOGGER_CONFIG__?: Record<string, any>;
  }
}