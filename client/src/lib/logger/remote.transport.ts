/**
 * @fileoverview Remote Transport for Logger
 * @module lib/logger/remote.transport
 * @description Remote logging transport with:
 * - Batch sending for performance
 * - Automatic retry on failure
 * - Queue management
 * - Network-aware sending
 * - Compression support
 * - Local storage fallback
 * 
 * @version 2.0.0
 */

import type { LogEntry, LogLevel } from './console.transport';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface RemoteTransportConfig {
  enabled?: boolean;
  endpoint: string;
  minLevel?: LogLevel;
  batchSize?: number;
  flushInterval?: number; // milliseconds
  maxRetries?: number;
  retryDelay?: number; // milliseconds
  headers?: Record<string, string>;
  includeMetadata?: boolean;
  useCompression?: boolean;
  useLocalStorage?: boolean;
  onError?: (error: Error) => void;
}

interface QueuedLog extends LogEntry {
  id: string;
  attempts: number;
}

// ============================================================================
// REMOTE TRANSPORT CLASS
// ============================================================================

export class RemoteTransport {
  private config: Required<RemoteTransportConfig>;
  private queue: QueuedLog[] = [];
  private flushTimer?: ReturnType<typeof setTimeout>;
  private isSending: boolean = false;
  private isOnline: boolean = true;

  constructor(config: RemoteTransportConfig) {
    this.config = {
      enabled: true,
      minLevel: config.minLevel || 'info' as LogLevel,
      batchSize: 10,
      flushInterval: 5000,
      maxRetries: 3,
      retryDelay: 1000,
      headers: {},
      includeMetadata: true,
      useCompression: false,
      useLocalStorage: true,
      onError: () => {},
      ...config
    };

    this.initialize();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  private initialize(): void {
    // Setup network listener
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline.bind(this));
      window.addEventListener('offline', this.handleOffline.bind(this));
      this.isOnline = navigator.onLine;
    }

    // Load queued logs from localStorage
    if (this.config.useLocalStorage) {
      this.loadFromStorage();
    }

    // Start flush timer
    this.startFlushTimer();

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
      window.addEventListener('pagehide', this.handleBeforeUnload.bind(this));
    }
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  /**
   * Add log entry to queue
   */
  log(entry: LogEntry): void {
    if (!this.config.enabled) return;
    if (!this.shouldLog(entry.level)) return;

    const queuedLog: QueuedLog = {
      ...entry,
      id: this.generateId(),
      attempts: 0
    };

    this.queue.push(queuedLog);

    // Auto-flush if batch size reached
    if (this.queue.length >= this.config.batchSize) {
      this.flush();
    }

    // Save to localStorage
    if (this.config.useLocalStorage) {
      this.saveToStorage();
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = ['error', 'warn', 'info', 'debug', 'trace'] as const;
    const minLevelIndex = levels.indexOf(this.config.minLevel);
    const currentLevelIndex = levels.indexOf(level);
    return currentLevelIndex <= minLevelIndex;
  }

  // ============================================================================
  // FLUSHING
  // ============================================================================

  /**
   * Flush logs to remote server
   */
  async flush(): Promise<void> {
    if (!this.config.enabled) return;
    if (this.queue.length === 0) return;
    if (this.isSending) return;
    if (!this.isOnline) return;

    this.isSending = true;

    try {
      // Take batch from queue
      const batch = this.queue.splice(0, this.config.batchSize);

      // Send batch
      await this.sendBatch(batch);

      // Clear from storage
      if (this.config.useLocalStorage) {
        this.saveToStorage();
      }
    } catch (error) {
      console.error('[RemoteTransport] Flush failed:', error);
    } finally {
      this.isSending = false;

      // Continue flushing if queue has items
      if (this.queue.length > 0) {
        setTimeout(() => this.flush(), 100);
      }
    }
  }

  /**
   * Force flush immediately (synchronous for beforeunload)
   */
  private forceFlush(): void {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.config.batchSize);
    const payload = this.preparePayload(batch);

    // Use sendBeacon for synchronous sending on page unload
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], {
        type: 'application/json'
      });
      navigator.sendBeacon(this.config.endpoint, blob);
    }
  }

  // ============================================================================
  // SENDING
  // ============================================================================

  private async sendBatch(batch: QueuedLog[]): Promise<void> {
    const payload = this.preparePayload(batch);

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      // Retry failed logs
      await this.handleSendError(batch, error as Error);
    }
  }

  private preparePayload(batch: QueuedLog[]): any {
    return {
      logs: batch.map(log => ({
        level: log.level,
        message: log.message,
        timestamp: log.timestamp,
        context: log.context,
        metadata: this.config.includeMetadata ? log.metadata : undefined,
        error: log.error ? {
          name: log.error.name,
          message: log.error.message,
          stack: log.error.stack
        } : undefined
      })),
      meta: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        timestamp: Date.now()
      }
    };
  }

  // ============================================================================
  // ERROR HANDLING & RETRY
  // ============================================================================

  private async handleSendError(batch: QueuedLog[], error: Error): Promise<void> {
    console.error('[RemoteTransport] Send error:', error);

    // Filter logs that haven't exceeded max retries
    const retryableLogs = batch.filter(log => {
      log.attempts++;
      return log.attempts < this.config.maxRetries;
    });

    // Add back to queue for retry
    if (retryableLogs.length > 0) {
      this.queue.unshift(...retryableLogs);

      // Wait before retrying
      await this.sleep(this.config.retryDelay * batch[0].attempts);
    }

    // Call error handler
    this.config.onError(error);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ============================================================================
  // FLUSH TIMER
  // ============================================================================

  private startFlushTimer(): void {
    this.stopFlushTimer();
    
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private stopFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }
  }

  // ============================================================================
  // NETWORK HANDLING
  // ============================================================================

  private handleOnline(): void {
    this.isOnline = true;
    console.log('[RemoteTransport] Network online, flushing queued logs');
    this.flush();
  }

  private handleOffline(): void {
    this.isOnline = false;
    console.warn('[RemoteTransport] Network offline, queuing logs locally');
  }

  private handleBeforeUnload(): void {
    this.forceFlush();
  }

  // ============================================================================
  // LOCAL STORAGE
  // ============================================================================

  private saveToStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      const data = JSON.stringify(this.queue);
      localStorage.setItem('logger_queue', data);
    } catch (error) {
      console.error('[RemoteTransport] Failed to save to localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      const data = localStorage.getItem('logger_queue');
      if (data) {
        this.queue = JSON.parse(data);
        console.log(`[RemoteTransport] Loaded ${this.queue.length} logs from storage`);
      }
    } catch (error) {
      console.error('[RemoteTransport] Failed to load from localStorage:', error);
    }
  }

  private clearStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      localStorage.removeItem('logger_queue');
    } catch (error) {
      console.error('[RemoteTransport] Failed to clear localStorage:', error);
    }
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Get queue status
   */
  getQueueStatus(): {
    size: number;
    isSending: boolean;
    isOnline: boolean;
  } {
    return {
      size: this.queue.length,
      isSending: this.isSending,
      isOnline: this.isOnline
    };
  }

  /**
   * Clear queue
   */
  clearQueue(): void {
    this.queue = [];
    if (this.config.useLocalStorage) {
      this.clearStorage();
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<RemoteTransportConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Restart flush timer if interval changed
    if (config.flushInterval) {
      this.startFlushTimer();
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<RemoteTransportConfig> {
    return { ...this.config };
  }

  /**
   * Enable transport
   */
  enable(): void {
    this.config.enabled = true;
    this.startFlushTimer();
  }

  /**
   * Disable transport
   */
  disable(): void {
    this.config.enabled = false;
    this.stopFlushTimer();
  }

  /**
   * Destroy transport and cleanup
   */
  destroy(): void {
    this.stopFlushTimer();
    this.forceFlush();
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline.bind(this));
      window.removeEventListener('offline', this.handleOffline.bind(this));
      window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
      window.removeEventListener('pagehide', this.handleBeforeUnload.bind(this));
    }
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

/**
 * Create remote transport instance
 */
export const createRemoteTransport = (config: RemoteTransportConfig): RemoteTransport => {
  return new RemoteTransport(config);
};

// ============================================================================
// EXPORTS
// ============================================================================

export default RemoteTransport;