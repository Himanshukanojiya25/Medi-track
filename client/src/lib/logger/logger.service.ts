/**
 * @fileoverview Logger Service
 * @module lib/logger/logger.service
 * @description Enterprise-grade logging service with:
 * - Multiple transports (console, remote)
 * - Contextual logging
 * - Performance tracking
 * - Error tracking
 * - Log sampling
 * - Filtering
 * - Child loggers
 * 
 * @version 2.0.0
 */

import { ConsoleTransport, LogLevel, LogEntry, createConsoleTransport } from './console.transport';
import { RemoteTransport, createRemoteTransport, type RemoteTransportConfig } from './remote.transport';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface LoggerConfig {
  level?: LogLevel;
  context?: string;
  transports?: {
    console?: boolean | Partial<import('./console.transport').ConsoleTransportConfig>;
    remote?: boolean | RemoteTransportConfig;
  };
  enableSampling?: boolean;
  samplingRate?: number; // 0-1 (e.g., 0.1 = 10% of logs)
  filters?: Array<(entry: LogEntry) => boolean>;
}

export interface TimerResult {
  duration: number;
  formatted: string;
}

// ============================================================================
// LOGGER CLASS
// ============================================================================

export class Logger {
  private static instance: Logger;
  
  private config: Required<Omit<LoggerConfig, 'transports' | 'filters'>> & {
    transports: NonNullable<LoggerConfig['transports']>;
    filters: NonNullable<LoggerConfig['filters']>;
  };
  
  private transports: {
    console?: ConsoleTransport;
    remote?: RemoteTransport;
  } = {};
  
  private timers: Map<string, number> = new Map();

  private constructor(config: LoggerConfig = {}) {
    this.config = {
      level: LogLevel.DEBUG,
      context: 'App',
      transports: {},
      enableSampling: false,
      samplingRate: 1.0,
      filters: [],
      ...config
    };

    this.setupTransports();
  }

  static getInstance(config?: LoggerConfig): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config);
    }
    return Logger.instance;
  }

  // ============================================================================
  // TRANSPORT SETUP
  // ============================================================================

  private setupTransports(): void {
    const { transports } = this.config;

    // Console transport
    if (transports.console !== false) {
      const consoleConfig = typeof transports.console === 'object' 
        ? transports.console 
        : {};
      
      this.transports.console = createConsoleTransport({
        minLevel: this.config.level,
        ...consoleConfig
      });
    }

    // Remote transport
    if (transports.remote && typeof transports.remote === 'object') {
      this.transports.remote = createRemoteTransport({
        minLevel: LogLevel.WARN, // Only send warnings and errors by default
        ...transports.remote
      });
    }
  }

  // ============================================================================
  // LOGGING METHODS
  // ============================================================================

  /**
   * Log error message
   */
  error(message: string, metadata?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.ERROR, message, metadata, error);
  }

  /**
   * Log warning message
   */
  warn(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  /**
   * Log info message
   */
  info(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  /**
   * Log debug message
   */
  debug(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  /**
   * Log trace message
   */
  trace(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.TRACE, message, metadata);
  }

  /**
   * Generic log method
   */
  log(level: LogLevel, message: string, metadata?: Record<string, any>, error?: Error): void {
    // Check sampling
    if (this.config.enableSampling && !this.shouldSample()) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context: this.config.context,
      metadata,
      error,
      stack: error?.stack || (new Error().stack)
    };

    // Apply filters
    if (!this.applyFilters(entry)) {
      return;
    }

    // Send to transports
    this.sendToTransports(entry);
  }

  // ============================================================================
  // PERFORMANCE TRACKING
  // ============================================================================

  /**
   * Start performance timer
   */
  time(label: string): void {
    this.timers.set(label, performance.now());
  }

  /**
   * End performance timer and log
   */
  timeEnd(label: string, metadata?: Record<string, any>): TimerResult | undefined {
    const startTime = this.timers.get(label);
    
    if (!startTime) {
      this.warn(`Timer '${label}' does not exist`);
      return undefined;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    const formatted = this.formatDuration(duration);

    this.timers.delete(label);

    this.debug(`⏱️ ${label}: ${formatted}`, {
      duration,
      ...metadata
    });

    return { duration, formatted };
  }

  /**
   * Measure async function execution time
   */
  async measure<T>(
    label: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.time(label);
    try {
      const result = await fn();
      this.timeEnd(label, metadata);
      return result;
    } catch (error) {
      this.timeEnd(label, { ...metadata, error: true });
      throw error;
    }
  }

  private formatDuration(ms: number): string {
    if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
    if (ms < 1000) return `${ms.toFixed(2)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${(ms / 60000).toFixed(2)}m`;
  }

  // ============================================================================
  // CHILD LOGGERS
  // ============================================================================

  /**
   * Create child logger with new context
   */
  child(context: string, config?: Partial<LoggerConfig>): Logger {
    const childLogger = new Logger({
      ...this.config,
      context,
      ...config
    });

    // Share transports with parent
    childLogger.transports = this.transports;

    return childLogger;
  }

  // ============================================================================
  // FILTERING & SAMPLING
  // ============================================================================

  private shouldSample(): boolean {
    return Math.random() < this.config.samplingRate;
  }

  private applyFilters(entry: LogEntry): boolean {
    return this.config.filters.every(filter => filter(entry));
  }

  /**
   * Add filter function
   */
  addFilter(filter: (entry: LogEntry) => boolean): void {
    this.config.filters.push(filter);
  }

  /**
   * Remove all filters
   */
  clearFilters(): void {
    this.config.filters = [];
  }

  // ============================================================================
  // TRANSPORT MANAGEMENT
  // ============================================================================

  private sendToTransports(entry: LogEntry): void {
    if (this.transports.console) {
      this.transports.console.log(entry);
    }

    if (this.transports.remote) {
      this.transports.remote.log(entry);
    }
  }

  /**
   * Enable/disable console transport
   */
  setConsoleEnabled(enabled: boolean): void {
    if (this.transports.console) {
      if (enabled) {
        this.transports.console.enable();
      } else {
        this.transports.console.disable();
      }
    }
  }

  /**
   * Enable/disable remote transport
   */
  setRemoteEnabled(enabled: boolean): void {
    if (this.transports.remote) {
      if (enabled) {
        this.transports.remote.enable();
      } else {
        this.transports.remote.disable();
      }
    }
  }

  /**
   * Flush remote transport
   */
  async flush(): Promise<void> {
    if (this.transports.remote) {
      await this.transports.remote.flush();
    }
  }

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  /**
   * Set log level
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;

    if (this.transports.console) {
      this.transports.console.setMinLevel(level);
    }
  }

  /**
   * Set context
   */
  setContext(context: string): void {
    this.config.context = context;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config } as any;
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<LoggerConfig> {
    return { ...this.config };
  }

  // ============================================================================
  // CLEANUP
  // ============================================================================

  /**
   * Destroy logger and cleanup resources
   */
  destroy(): void {
    if (this.transports.remote) {
      this.transports.remote.destroy();
    }
    this.timers.clear();
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const logger = Logger.getInstance();

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

export const log = {
  error: (message: string, metadata?: Record<string, any>, error?: Error) => 
    logger.error(message, metadata, error),
  
  warn: (message: string, metadata?: Record<string, any>) => 
    logger.warn(message, metadata),
  
  info: (message: string, metadata?: Record<string, any>) => 
    logger.info(message, metadata),
  
  debug: (message: string, metadata?: Record<string, any>) => 
    logger.debug(message, metadata),
  
  trace: (message: string, metadata?: Record<string, any>) => 
    logger.trace(message, metadata),
  
  time: (label: string) => 
    logger.time(label),
  
  timeEnd: (label: string, metadata?: Record<string, any>) => 
    logger.timeEnd(label, metadata),
  
  measure: <T>(label: string, fn: () => Promise<T>, metadata?: Record<string, any>) => 
    logger.measure(label, fn, metadata)
};

// ============================================================================
// DECORATOR
// ============================================================================

/**
 * Log method execution time
 */
export function LogExecutionTime(label?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const timerLabel = label || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      logger.time(timerLabel);
      try {
        const result = await originalMethod.apply(this, args);
        logger.timeEnd(timerLabel);
        return result;
      } catch (error) {
        logger.timeEnd(timerLabel, { error: true });
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Log method calls
 */
export function LogMethodCall(context?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const logContext = context || target.constructor.name;

    descriptor.value = function (...args: any[]) {
      logger.debug(`[${logContext}] Calling ${propertyKey}`, {
        arguments: args
      });

      try {
        const result = originalMethod.apply(this, args);
        
        if (result instanceof Promise) {
          return result
            .then(res => {
              logger.debug(`[${logContext}] ${propertyKey} completed`);
              return res;
            })
            .catch(error => {
              logger.error(`[${logContext}] ${propertyKey} failed`, {}, error);
              throw error;
            });
        }
        
        logger.debug(`[${logContext}] ${propertyKey} completed`);
        return result;
      } catch (error) {
        logger.error(`[${logContext}] ${propertyKey} failed`, {}, error as Error);
        throw error;
      }
    };

    return descriptor;
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export { LogLevel } from './console.transport';
export type { LogEntry } from './console.transport';
export default logger;