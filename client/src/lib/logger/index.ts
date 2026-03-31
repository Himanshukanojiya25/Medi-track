/**
 * @fileoverview Logger Module - Main Entry Point
 * @module lib/logger
 * @description Centralized logging system with multiple transports
 * 
 * @example
 * ```typescript
 * // Simple usage
 * import { logger } from '../../lib/logger';
 * 
 * logger.info('User logged in', { userId: '123' });
 * logger.error('Failed to fetch data', { endpoint: '/api/users' }, error);
 * 
 * // Performance tracking
 * logger.time('fetchUsers');
 * await fetchUsers();
 * logger.timeEnd('fetchUsers');
 * 
 * // Or use measure
 * await logger.measure('fetchUsers', async () => {
 *   return await fetchUsers();
 * });
 * 
 * // Child logger with context
 * const authLogger = logger.child('Auth');
 * authLogger.info('Login attempt', { email });
 * 
 * // Convenience functions
 * import { log } from '../../lib/logger';
 * 
 * log.info('Quick logging');
 * log.error('Error occurred', {}, error);
 * ```
 * 
 * @version 2.0.0
 */

// ============================================================================
// LOGGER SERVICE EXPORTS
// ============================================================================

export {
  Logger,
  logger,
  log,
  LogExecutionTime,
  LogMethodCall,
  type LoggerConfig,
  type TimerResult
} from './logger.service';

// ============================================================================
// CONSOLE TRANSPORT EXPORTS
// ============================================================================

export {
  ConsoleTransport,
  createConsoleTransport,
  LogLevel,
  type LogEntry,
  type ConsoleTransportConfig
} from './console.transport';

// ============================================================================
// REMOTE TRANSPORT EXPORTS
// ============================================================================

export {
  RemoteTransport,
  createRemoteTransport,
  type RemoteTransportConfig
} from './remote.transport';

// ============================================================================
// DEFAULT LOGGER INSTANCE
// ============================================================================

import { logger } from './logger.service';

/**
 * Default logger instance (re-exported for convenience)
 */
export default logger;

// ============================================================================
// LOGGER FACTORY
// ============================================================================

import { Logger, type LoggerConfig } from './logger.service';

/**
 * Create custom logger instance
 */
export const createLogger = (config: LoggerConfig): Logger => {
  return Logger.getInstance(config);
};

/**
 * Create logger with remote transport
 */
export const createRemoteLogger = (
  endpoint: string,
  config?: Partial<LoggerConfig>
): Logger => {
  return Logger.getInstance({
    ...config,
    transports: {
      console: true,
      remote: {
        endpoint,
        minLevel: 'warn' as import('./console.transport').LogLevel,
        batchSize: 10,
        flushInterval: 5000
      }
    }
  });
};

/**
 * Create production logger (console disabled, remote enabled)
 */
export const createProductionLogger = (
  endpoint: string,
  context: string = 'App'
): Logger => {
  return Logger.getInstance({
    level: 'warn' as import('./console.transport').LogLevel,
    context,
    transports: {
      console: false,
      remote: {
        endpoint,
        minLevel: 'warn' as import('./console.transport').LogLevel,
        batchSize: 20,
        flushInterval: 3000
      }
    }
  });
};

/**
 * Create development logger (console only)
 */
export const createDevelopmentLogger = (context: string = 'App'): Logger => {
  return Logger.getInstance({
    level: 'debug' as import('./console.transport').LogLevel,
    context,
    transports: {
      console: {
        enabled: true,
        prettyPrint: true,
        colors: true,
        timestamps: true
      },
      remote: false
    }
  });
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create contextual logger
 */
export const createContextLogger = (context: string): {
  error: (message: string, metadata?: Record<string, any>, error?: Error) => void;
  warn: (message: string, metadata?: Record<string, any>) => void;
  info: (message: string, metadata?: Record<string, any>) => void;
  debug: (message: string, metadata?: Record<string, any>) => void;
  trace: (message: string, metadata?: Record<string, any>) => void;
} => {
  const contextLogger = logger.child(context);
  
  return {
    error: (msg, meta, err) => contextLogger.error(msg, meta, err),
    warn: (msg, meta) => contextLogger.warn(msg, meta),
    info: (msg, meta) => contextLogger.info(msg, meta),
    debug: (msg, meta) => contextLogger.debug(msg, meta),
    trace: (msg, meta) => contextLogger.trace(msg, meta)
  };
};

/**
 * Format error for logging
 */
export const formatError = (error: Error): Record<string, any> => {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...Object.getOwnPropertyNames(error).reduce((acc, key) => {
      if (!['name', 'message', 'stack'].includes(key)) {
        acc[key] = (error as any)[key];
      }
      return acc;
    }, {} as Record<string, any>)
  };
};

/**
 * Safe stringify for logging (handles circular references)
 */
export const safeStringify = (obj: any, indent: number = 0): string => {
  const seen = new WeakSet();
  
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  }, indent);
};

/**
 * Redact sensitive fields from object
 */
export const redactSensitive = (
  obj: any,
  sensitiveFields: string[] = ['password', 'token', 'secret', 'apiKey', 'creditCard']
): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const redacted = Array.isArray(obj) ? [...obj] : { ...obj };

  Object.keys(redacted).forEach(key => {
    const lowerKey = key.toLowerCase();
    
    if (sensitiveFields.some(field => lowerKey.includes(field.toLowerCase()))) {
      redacted[key] = '***REDACTED***';
    } else if (typeof redacted[key] === 'object' && redacted[key] !== null) {
      redacted[key] = redactSensitive(redacted[key], sensitiveFields);
    }
  });

  return redacted;
};

// ============================================================================
// PERFORMANCE HELPERS
// ============================================================================

/**
 * Measure function execution time
 */
export const measurePerformance = async <T>(
  fn: () => Promise<T>,
  label?: string
): Promise<{ result: T; duration: number }> => {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;

  if (label) {
    logger.debug(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
  }

  return { result, duration };
};

/**
 * Create performance marker
 */
export const mark = (name: string): void => {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name);
  }
};

/**
 * Measure between two marks
 */
export const measure = (
  name: string,
  startMark: string,
  endMark: string
): number | undefined => {
  if (typeof performance !== 'undefined' && performance.measure) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name, 'measure')[0];
      return measure ? measure.duration : undefined;
    } catch (error) {
      logger.warn('Performance measurement failed', { error });
      return undefined;
    }
  }
  return undefined;
};

// ============================================================================
// ERROR LOGGING HELPERS
// ============================================================================

/**
 * Log unhandled errors
 */
export const setupGlobalErrorHandling = (): void => {
  if (typeof window === 'undefined') return;

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled Promise Rejection', {
      reason: event.reason,
      promise: 'Promise'
    }, event.reason instanceof Error ? event.reason : undefined);
  });

  // Global errors
  window.addEventListener('error', (event) => {
    logger.error('Global Error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    }, event.error);
  });
};

/**
 * Log API errors
 */
export const logApiError = (
  endpoint: string,
  method: string,
  error: any,
  metadata?: Record<string, any>
): void => {
  logger.error('API Error', {
    endpoint,
    method,
    status: error?.response?.status,
    statusText: error?.response?.statusText,
    ...metadata
  }, error);
};

/**
 * Log navigation/routing events
 */
export const logNavigation = (from: string, to: string, metadata?: Record<string, any>): void => {
  logger.info('Navigation', {
    from,
    to,
    timestamp: Date.now(),
    ...metadata
  });
};

// ============================================================================
// DEBUG HELPERS
// ============================================================================

/**
 * Create debug logger (only logs in development)
 */
export const createDebugLogger = (context: string) => {
  const isDev = typeof window !== 'undefined' && 
    (window.location?.hostname === 'localhost' || window.location?.hostname === '127.0.0.1');

  return {
    log: (...args: any[]) => {
      if (isDev) {
        console.log(`[${context}]`, ...args);
      }
    },
    warn: (...args: any[]) => {
      if (isDev) {
        console.warn(`[${context}]`, ...args);
      }
    },
    error: (...args: any[]) => {
      console.error(`[${context}]`, ...args);
    }
  };
};

/**
 * Enable verbose logging
 */
export const enableVerboseLogging = (): void => {
  logger.setLevel('trace' as import('./console.transport').LogLevel);
  logger.info('Verbose logging enabled');
};

/**
 * Disable console logging
 */
export const disableConsoleLogging = (): void => {
  logger.setConsoleEnabled(false);
};

/**
 * Enable console logging
 */
export const enableConsoleLogging = (): void => {
  logger.setConsoleEnabled(true);
};

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if value is Error
 */
export const isError = (value: any): value is Error => {
  return value instanceof Error;
};

/**
 * Check if log level is enabled
 */
export const isLevelEnabled = (level: import('./console.transport').LogLevel): boolean => {
  const config = logger.getConfig();
  const levels: import('./console.transport').LogLevel[] = ['error', 'warn', 'info', 'debug', 'trace'];
  const currentIndex = levels.indexOf(config.level!);
  const checkIndex = levels.indexOf(level);
  return checkIndex <= currentIndex;
};