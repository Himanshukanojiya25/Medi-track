/**
 * @fileoverview Console Transport for Logger
 * @module lib/logger/console.transport
 * @description Browser console transport with:
 * - Colored output by log level
 * - Pretty formatting
 * - Stack trace rendering
 * - Metadata display
 * - Group/collapse support
 * - Performance-optimized
 * 
 * @version 2.0.0
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace'
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: string;
  metadata?: Record<string, any>;
  error?: Error;
  stack?: string;
}

export interface ConsoleTransportConfig {
  enabled?: boolean;
  minLevel?: LogLevel;
  colors?: boolean;
  timestamps?: boolean;
  showContext?: boolean;
  showMetadata?: boolean;
  prettyPrint?: boolean;
  groupCollapsed?: boolean;
}

// ============================================================================
// LOG LEVEL PRIORITY
// ============================================================================

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  [LogLevel.ERROR]: 0,
  [LogLevel.WARN]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.DEBUG]: 3,
  [LogLevel.TRACE]: 4
};

// ============================================================================
// CONSOLE STYLES
// ============================================================================

const LEVEL_STYLES: Record<LogLevel, string> = {
  [LogLevel.ERROR]: 'color: #ff5555; font-weight: bold;',
  [LogLevel.WARN]: 'color: #ffaa00; font-weight: bold;',
  [LogLevel.INFO]: 'color: #55aaff; font-weight: bold;',
  [LogLevel.DEBUG]: 'color: #aa55ff; font-weight: bold;',
  [LogLevel.TRACE]: 'color: #999999; font-weight: bold;'
};

const LEVEL_EMOJIS: Record<LogLevel, string> = {
  [LogLevel.ERROR]: '❌',
  [LogLevel.WARN]: '⚠️',
  [LogLevel.INFO]: 'ℹ️',
  [LogLevel.DEBUG]: '🐛',
  [LogLevel.TRACE]: '🔍'
};

const LEVEL_COLORS: Record<LogLevel, string> = {
  [LogLevel.ERROR]: '#ff5555',
  [LogLevel.WARN]: '#ffaa00',
  [LogLevel.INFO]: '#55aaff',
  [LogLevel.DEBUG]: '#aa55ff',
  [LogLevel.TRACE]: '#999999'
};

// ============================================================================
// CONSOLE TRANSPORT CLASS
// ============================================================================

export class ConsoleTransport {
  private config: Required<ConsoleTransportConfig>;

  constructor(config: ConsoleTransportConfig = {}) {
    this.config = {
      enabled: true,
      minLevel: LogLevel.DEBUG,
      colors: true,
      timestamps: true,
      showContext: true,
      showMetadata: true,
      prettyPrint: true,
      groupCollapsed: false,
      ...config
    };
  }

  /**
   * Log entry to console
   */
  log(entry: LogEntry): void {
    if (!this.config.enabled) return;
    if (!this.shouldLog(entry.level)) return;

    if (this.config.prettyPrint) {
      this.logPretty(entry);
    } else {
      this.logSimple(entry);
    }
  }

  /**
   * Check if log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] <= LOG_LEVEL_PRIORITY[this.config.minLevel];
  }

  // ============================================================================
  // PRETTY LOGGING
  // ============================================================================

  private logPretty(entry: LogEntry): void {
    const { level, message, timestamp, context, metadata, error, stack } = entry;

    // Create log parts
    const parts: string[] = [];
    const styles: string[] = [];

    // Emoji
    parts.push(`${LEVEL_EMOJIS[level]}`);
    styles.push('');

    // Timestamp
    if (this.config.timestamps) {
      const time = this.formatTimestamp(timestamp);
      parts.push(`%c[${time}]`);
      styles.push('color: #999999;');
    }

    // Level
    parts.push(`%c[${level.toUpperCase()}]`);
    styles.push(LEVEL_STYLES[level]);

    // Context
    if (context && this.config.showContext) {
      parts.push(`%c[${context}]`);
      styles.push('color: #00aa88; font-weight: bold;');
    }

    // Message
    parts.push('%c' + message);
    styles.push('color: inherit;');

    // Log to console
    const consoleMethod = this.getConsoleMethod(level);
    consoleMethod(parts.join(' '), ...styles);

    // Metadata
    if (metadata && this.config.showMetadata && Object.keys(metadata).length > 0) {
      if (this.config.groupCollapsed) {
        console.groupCollapsed('📋 Metadata');
      }
      console.table(metadata);
      if (this.config.groupCollapsed) {
        console.groupEnd();
      }
    }

    // Error
    if (error) {
      this.logError(error);
    }

    // Stack trace
    if (stack && !error) {
      console.groupCollapsed('📚 Stack Trace');
      console.log(stack);
      console.groupEnd();
    }
  }

  // ============================================================================
  // SIMPLE LOGGING
  // ============================================================================

  private logSimple(entry: LogEntry): void {
    const { level, message, timestamp, context, metadata, error } = entry;

    const parts: string[] = [];

    // Timestamp
    if (this.config.timestamps) {
      parts.push(`[${this.formatTimestamp(timestamp)}]`);
    }

    // Level
    parts.push(`[${level.toUpperCase()}]`);

    // Context
    if (context && this.config.showContext) {
      parts.push(`[${context}]`);
    }

    // Message
    parts.push(message);

    // Log to console
    const consoleMethod = this.getConsoleMethod(level);
    const output = parts.join(' ');

    if (metadata && this.config.showMetadata) {
      consoleMethod(output, metadata);
    } else {
      consoleMethod(output);
    }

    // Error
    if (error) {
      console.error(error);
    }
  }

  // ============================================================================
  // ERROR LOGGING
  // ============================================================================

  private logError(error: Error): void {
    console.groupCollapsed('🔥 Error Details');
    
    console.log('%cName:', 'font-weight: bold;', error.name);
    console.log('%cMessage:', 'font-weight: bold;', error.message);
    
    if (error.stack) {
      console.log('%cStack:', 'font-weight: bold;');
      console.log(error.stack);
    }

    // Additional error properties
    const errorProps = Object.keys(error).filter(key => 
      !['name', 'message', 'stack'].includes(key)
    );

    if (errorProps.length > 0) {
      console.log('%cAdditional Properties:', 'font-weight: bold;');
      errorProps.forEach(key => {
        console.log(`  ${key}:`, (error as any)[key]);
      });
    }

    console.groupEnd();
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  private getConsoleMethod(level: LogLevel): (...args: any[]) => void {
    switch (level) {
      case LogLevel.ERROR:
        return console.error.bind(console);
      case LogLevel.WARN:
        return console.warn.bind(console);
      case LogLevel.INFO:
        return console.info.bind(console);
      case LogLevel.DEBUG:
        return console.debug.bind(console);
      case LogLevel.TRACE:
        return console.log.bind(console);
      default:
        return console.log.bind(console);
    }
  }

  private formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${ms}`;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ConsoleTransportConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<ConsoleTransportConfig> {
    return { ...this.config };
  }

  /**
   * Enable transport
   */
  enable(): void {
    this.config.enabled = true;
  }

  /**
   * Disable transport
   */
  disable(): void {
    this.config.enabled = false;
  }

  /**
   * Set minimum log level
   */
  setMinLevel(level: LogLevel): void {
    this.config.minLevel = level;
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

/**
 * Create console transport instance
 */
export const createConsoleTransport = (config?: ConsoleTransportConfig): ConsoleTransport => {
  return new ConsoleTransport(config);
};

// ============================================================================
// EXPORTS
// ============================================================================

export default ConsoleTransport;