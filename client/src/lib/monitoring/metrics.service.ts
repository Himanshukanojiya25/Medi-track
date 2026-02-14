// src/lib/monitoring/metrics.ts

/**
 * 🎯 Production-Grade Metrics & Monitoring System
 * ✅ Works in Browser & Node.js
 * ✅ Multiple metric types (counters, gauges, histograms, timings)
 * ✅ Aggregation & reporting
 * ✅ Memory efficient
 * ✅ Extensible backends (Console, HTTP, DataDog, etc.)
 */

// ================ TYPES ================

export type MetricType = 'counter' | 'gauge' | 'histogram' | 'timing';

export interface MetricValue {
  type: MetricType;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

export interface Counter {
  count: number;
  tags?: Record<string, string>;
}

export interface Gauge {
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

export interface Histogram {
  values: number[];
  count: number;
  sum: number;
  min: number;
  max: number;
  avg: number;
  p50: number;
  p95: number;
  p99: number;
}

export interface Timing {
  durations: number[];
  count: number;
  sum: number;
  min: number;
  max: number;
  avg: number;
  p50: number;
  p95: number;
  p99: number;
}

export interface MetricsSnapshot {
  counters: Record<string, Counter>;
  gauges: Record<string, Gauge>;
  histograms: Record<string, Histogram>;
  timings: Record<string, Timing>;
  timestamp: number;
}

export interface MetricsConfig {
  enabled: boolean;
  sampleRate: number;        // 0-1, for high-volume scenarios
  flushInterval: number;     // ms
  maxHistogramSize: number;  // Max samples per histogram
  backends: MetricsBackend[];
}

export interface MetricsBackend {
  name: string;
  send(snapshot: MetricsSnapshot): Promise<void> | void;
}

// ================ ENVIRONMENT DETECTION ================

const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};

const isNode = (): boolean => {
  return !isBrowser() && typeof globalThis !== 'undefined';
};

// ================ BUILT-IN BACKENDS ================

/**
 * Console Backend - Logs metrics to console
 */
export class ConsoleBackend implements MetricsBackend {
  name = 'console';

  send(snapshot: MetricsSnapshot): void {
    console.log('📊 [METRICS]', {
      timestamp: new Date(snapshot.timestamp).toISOString(),
      counters: Object.keys(snapshot.counters).length,
      gauges: Object.keys(snapshot.gauges).length,
      histograms: Object.keys(snapshot.histograms).length,
      timings: Object.keys(snapshot.timings).length
    });

    // Log individual metrics (only in dev)
    if (this.isDevelopment()) {
      if (Object.keys(snapshot.counters).length > 0) {
        console.log('Counters:', snapshot.counters);
      }
      if (Object.keys(snapshot.gauges).length > 0) {
        console.log('Gauges:', snapshot.gauges);
      }
      if (Object.keys(snapshot.timings).length > 0) {
        console.log('Timings:', snapshot.timings);
      }
    }
  }

  private isDevelopment(): boolean {
    if (isBrowser()) {
      return (window as any).__ENV__?.NODE_ENV !== 'production';
    }
    try {
      const proc = (globalThis as any).process;
      return proc?.env?.NODE_ENV !== 'production';
    } catch {
      return true;
    }
  }
}

/**
 * HTTP Backend - Sends metrics to HTTP endpoint
 */
export class HttpBackend implements MetricsBackend {
  name = 'http';
  private endpoint: string;
  private headers: Record<string, string>;

  constructor(endpoint: string, headers?: Record<string, string>) {
    this.endpoint = endpoint;
    this.headers = headers || { 'Content-Type': 'application/json' };
  }

  async send(snapshot: MetricsSnapshot): Promise<void> {
    if (typeof fetch === 'undefined') {
      console.warn('[Metrics] Fetch API not available, skipping HTTP backend');
      return;
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(snapshot)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('[Metrics] Failed to send to HTTP backend:', error);
    }
  }
}

/**
 * Window Storage Backend - Stores in window.__METRICS__
 */
export class WindowStorageBackend implements MetricsBackend {
  name = 'window-storage';

  send(snapshot: MetricsSnapshot): void {
    if (!isBrowser()) return;

    try {
      (window as any).__METRICS__ = {
        counters: snapshot.counters,
        gauges: snapshot.gauges,
        histograms: snapshot.histograms,
        timings: snapshot.timings,
        timestamp: snapshot.timestamp
      };
    } catch (error) {
      console.error('[Metrics] Failed to store in window:', error);
    }
  }
}

// ================ MAIN METRICS CLASS ================

class Metrics {
  private static instance: Metrics;
  private config: MetricsConfig;
  private counters: Map<string, Counter> = new Map();
  private gauges: Map<string, Gauge> = new Map();
  private histograms: Map<string, number[]> = new Map();
  private timings: Map<string, number[]> = new Map();
  private flushTimerId: number | null = null;
  private isShuttingDown = false;

  private constructor(config?: Partial<MetricsConfig>) {
    this.config = {
      enabled: true,
      sampleRate: 1.0,
      flushInterval: 60000, // 1 minute
      maxHistogramSize: 1000,
      backends: [new ConsoleBackend()],
      ...config
    };

    this.setupFlushInterval();
    this.setupGlobalHandlers();
  }

  static getInstance(config?: Partial<MetricsConfig>): Metrics {
    if (!Metrics.instance) {
      Metrics.instance = new Metrics(config);
    }
    return Metrics.instance;
  }

  // ================ COUNTERS ================

  /**
   * Increment a counter
   * @example metrics.incrementCounter('api.requests', 1)
   */
  incrementCounter(name: string, value: number = 1, tags?: Record<string, string>): void {
    if (!this.shouldRecord()) return;

    const existing = this.counters.get(name) || { count: 0, tags };
    existing.count += value;
    this.counters.set(name, existing);
  }

  /**
   * Decrement a counter
   */
  decrementCounter(name: string, value: number = 1, tags?: Record<string, string>): void {
    this.incrementCounter(name, -value, tags);
  }

  /**
   * Set counter to specific value
   */
  setCounter(name: string, value: number, tags?: Record<string, string>): void {
    if (!this.shouldRecord()) return;
    this.counters.set(name, { count: value, tags });
  }

  /**
   * Get counter value
   */
  getCounter(name: string): number {
    return this.counters.get(name)?.count || 0;
  }

  // ================ GAUGES ================

  /**
   * Set a gauge value (current state)
   * @example metrics.setGauge('memory.used', process.memoryUsage().heapUsed)
   */
  setGauge(name: string, value: number, tags?: Record<string, string>): void {
    if (!this.shouldRecord()) return;

    this.gauges.set(name, {
      value,
      timestamp: Date.now(),
      tags
    });
  }

  /**
   * Increment gauge
   */
  incrementGauge(name: string, value: number = 1, tags?: Record<string, string>): void {
    const existing = this.gauges.get(name);
    const currentValue = existing?.value || 0;
    this.setGauge(name, currentValue + value, tags);
  }

  /**
   * Decrement gauge
   */
  decrementGauge(name: string, value: number = 1, tags?: Record<string, string>): void {
    this.incrementGauge(name, -value, tags);
  }

  /**
   * Get gauge value
   */
  getGauge(name: string): number {
    return this.gauges.get(name)?.value || 0;
  }

  // ================ HISTOGRAMS ================

  /**
   * Record a histogram value (distribution)
   * @example metrics.recordHistogram('api.response_size', responseBody.length)
   */
  recordHistogram(name: string, value: number): void {
    if (!this.shouldRecord()) return;

    let values = this.histograms.get(name) || [];
    values.push(value);

    // Limit size to prevent memory issues
    if (values.length > this.config.maxHistogramSize) {
      values = values.slice(-this.config.maxHistogramSize);
    }

    this.histograms.set(name, values);
  }

  // ================ TIMINGS ================

  /**
   * Record a timing (duration in milliseconds)
   * @example metrics.recordTiming('api.latency', 150)
   */
  recordTiming(name: string, duration: number): void {
    if (!this.shouldRecord()) return;

    let durations = this.timings.get(name) || [];
    durations.push(duration);

    // Limit size
    if (durations.length > this.config.maxHistogramSize) {
      durations = durations.slice(-this.config.maxHistogramSize);
    }

    this.timings.set(name, durations);
  }

  /**
   * Time a function execution
   * @example await metrics.time('db.query', () => db.query('SELECT...'))
   */
  async time<T>(name: string, fn: () => T | Promise<T>): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      this.recordTiming(name, Date.now() - start);
      return result;
    } catch (error) {
      this.recordTiming(name, Date.now() - start);
      this.incrementCounter(`${name}.error`);
      throw error;
    }
  }

  /**
   * Create a timer that can be stopped manually
   * @example 
   * const timer = metrics.startTimer('operation');
   * // ... do work
   * timer.stop();
   */
  startTimer(name: string): { stop: () => number } {
    const start = Date.now();
    return {
      stop: () => {
        const duration = Date.now() - start;
        this.recordTiming(name, duration);
        return duration;
      }
    };
  }

  // ================ SNAPSHOT & REPORTING ================

  /**
   * Get current metrics snapshot
   */
  getSnapshot(): MetricsSnapshot {
    return {
      counters: Object.fromEntries(this.counters),
      gauges: Object.fromEntries(this.gauges),
      histograms: this.computeHistograms(),
      timings: this.computeTimings(),
      timestamp: Date.now()
    };
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
    this.timings.clear();
  }

  /**
   * Get metrics summary (human-readable)
   */
  getSummary(): string {
    const snapshot = this.getSnapshot();
    const lines: string[] = ['📊 Metrics Summary', ''];

    // Counters
    if (Object.keys(snapshot.counters).length > 0) {
      lines.push('Counters:');
      Object.entries(snapshot.counters).forEach(([name, data]) => {
        lines.push(`  ${name}: ${data.count}`);
      });
      lines.push('');
    }

    // Gauges
    if (Object.keys(snapshot.gauges).length > 0) {
      lines.push('Gauges:');
      Object.entries(snapshot.gauges).forEach(([name, data]) => {
        lines.push(`  ${name}: ${data.value}`);
      });
      lines.push('');
    }

    // Timings
    if (Object.keys(snapshot.timings).length > 0) {
      lines.push('Timings:');
      Object.entries(snapshot.timings).forEach(([name, data]) => {
        lines.push(`  ${name}: avg=${data.avg.toFixed(2)}ms p95=${data.p95.toFixed(2)}ms`);
      });
      lines.push('');
    }

    return lines.join('\n');
  }

  // ================ CONFIGURATION ================

  updateConfig(config: Partial<MetricsConfig>): void {
    this.config = { ...this.config, ...config };

    if (config.flushInterval !== undefined) {
      this.stopFlushInterval();
      this.setupFlushInterval();
    }
  }

  getConfig(): Readonly<MetricsConfig> {
    return { ...this.config };
  }

  addBackend(backend: MetricsBackend): void {
    this.config.backends.push(backend);
  }

  removeBackend(name: string): void {
    this.config.backends = this.config.backends.filter(b => b.name !== name);
  }

  // ================ LIFECYCLE ================

  async flush(): Promise<void> {
    if (!this.config.enabled || this.isShuttingDown) return;

    const snapshot = this.getSnapshot();

    // Send to all backends
    const promises = this.config.backends.map(backend => {
      try {
        return backend.send(snapshot);
      } catch (error) {
        console.error(`[Metrics] Backend ${backend.name} failed:`, error);
        return Promise.resolve();
      }
    });

    await Promise.allSettled(promises);
  }

  async shutdown(): Promise<void> {
    this.isShuttingDown = true;
    this.stopFlushInterval();
    await this.flush();
  }

  // ================ PRIVATE METHODS ================

  private shouldRecord(): boolean {
    if (!this.config.enabled) return false;
    if (this.config.sampleRate >= 1.0) return true;
    return Math.random() < this.config.sampleRate;
  }

  private setupFlushInterval(): void {
    if (this.flushTimerId !== null) return;

    this.flushTimerId = setInterval(() => {
      this.flush().catch(error => {
        console.error('[Metrics] Flush failed:', error);
      });
    }, this.config.flushInterval) as unknown as number;
  }

  private stopFlushInterval(): void {
    if (this.flushTimerId !== null) {
      clearInterval(this.flushTimerId);
      this.flushTimerId = null;
    }
  }

  private setupGlobalHandlers(): void {
    if (isBrowser()) {
      // Flush on page unload
      window.addEventListener('beforeunload', () => {
        this.flush();
      });

      // Track page visibility
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flush();
        }
      });
    }
  }

  private computeHistograms(): Record<string, Histogram> {
    const result: Record<string, Histogram> = {};

    this.histograms.forEach((values, name) => {
      if (values.length === 0) return;

      const sorted = [...values].sort((a, b) => a - b);
      const sum = values.reduce((a, b) => a + b, 0);

      result[name] = {
        values: sorted,
        count: values.length,
        sum,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        avg: sum / values.length,
        p50: this.percentile(sorted, 0.5),
        p95: this.percentile(sorted, 0.95),
        p99: this.percentile(sorted, 0.99)
      };
    });

    return result;
  }

  private computeTimings(): Record<string, Timing> {
    const result: Record<string, Timing> = {};

    this.timings.forEach((durations, name) => {
      if (durations.length === 0) return;

      const sorted = [...durations].sort((a, b) => a - b);
      const sum = durations.reduce((a, b) => a + b, 0);

      result[name] = {
        durations: sorted,
        count: durations.length,
        sum,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        avg: sum / durations.length,
        p50: this.percentile(sorted, 0.5),
        p95: this.percentile(sorted, 0.95),
        p99: this.percentile(sorted, 0.99)
      };
    });

    return result;
  }

  private percentile(sorted: number[], p: number): number {
    if (sorted.length === 0) return 0;
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[Math.max(0, index)];
  }
}

// ================ EXPORTS ================

/**
 * Create metrics instance with custom config
 */
export const createMetrics = (config?: Partial<MetricsConfig>): Metrics => {
  return Metrics.getInstance(config);
};

/**
 * Default metrics instance
 */
export const metrics = {
  // Counters
  incrementCounter: (name: string, value?: number, tags?: Record<string, string>) => {
    Metrics.getInstance().incrementCounter(name, value, tags);
  },
  decrementCounter: (name: string, value?: number, tags?: Record<string, string>) => {
    Metrics.getInstance().decrementCounter(name, value, tags);
  },
  setCounter: (name: string, value: number, tags?: Record<string, string>) => {
    Metrics.getInstance().setCounter(name, value, tags);
  },
  getCounter: (name: string) => {
    return Metrics.getInstance().getCounter(name);
  },

  // Gauges
  setGauge: (name: string, value: number, tags?: Record<string, string>) => {
    Metrics.getInstance().setGauge(name, value, tags);
  },
  incrementGauge: (name: string, value?: number, tags?: Record<string, string>) => {
    Metrics.getInstance().incrementGauge(name, value, tags);
  },
  decrementGauge: (name: string, value?: number, tags?: Record<string, string>) => {
    Metrics.getInstance().decrementGauge(name, value, tags);
  },
  getGauge: (name: string) => {
    return Metrics.getInstance().getGauge(name);
  },

  // Histograms
  recordHistogram: (name: string, value: number) => {
    Metrics.getInstance().recordHistogram(name, value);
  },

  // Timings
  recordTiming: (name: string, duration: number) => {
    Metrics.getInstance().recordTiming(name, duration);
  },
  time: <T>(name: string, fn: () => T | Promise<T>) => {
    return Metrics.getInstance().time(name, fn);
  },
  startTimer: (name: string) => {
    return Metrics.getInstance().startTimer(name);
  },

  // Reporting
  getSnapshot: () => {
    return Metrics.getInstance().getSnapshot();
  },
  getSummary: () => {
    return Metrics.getInstance().getSummary();
  },
  reset: () => {
    Metrics.getInstance().reset();
  },

  // Configuration
  updateConfig: (config: Partial<MetricsConfig>) => {
    Metrics.getInstance().updateConfig(config);
  },
  getConfig: () => {
    return Metrics.getInstance().getConfig();
  },
  addBackend: (backend: MetricsBackend) => {
    Metrics.getInstance().addBackend(backend);
  },
  removeBackend: (name: string) => {
    Metrics.getInstance().removeBackend(name);
  },

  // Lifecycle
  flush: () => {
    return Metrics.getInstance().flush();
  },
  shutdown: () => {
    return Metrics.getInstance().shutdown();
  }
};

export default metrics;
export { Metrics };
export type { Metrics as MetricsType };

// ================ GLOBAL TYPES ================

declare global {
  interface Window {
    __METRICS__?: {
      counters: Record<string, Counter>;
      gauges: Record<string, Gauge>;
      histograms: Record<string, Histogram>;
      timings: Record<string, Timing>;
      timestamp: number;
    };
  }
}