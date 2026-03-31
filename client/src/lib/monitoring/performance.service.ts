/**
 * @fileoverview Performance Monitoring Service
 * @module lib/monitoring/performance.service
 * @description Enterprise-grade performance monitoring with:
 * - Web Vitals (LCP, FID, CLS, FCP, TTFB)
 * - Resource timing
 * - Long tasks detection
 * - Memory monitoring
 * - Network information
 * - Custom performance marks
 * - Performance budgets
 * 
 * @version 2.0.0
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface WebVitals {
  LCP?: number;  // Largest Contentful Paint
  FID?: number;  // First Input Delay
  CLS?: number;  // Cumulative Layout Shift
  FCP?: number;  // First Contentful Paint
  TTFB?: number; // Time to First Byte
  INP?: number;  // Interaction to Next Paint
}

export interface ResourceTiming {
  name: string;
  duration: number;
  size?: number;
  type: string;
  startTime: number;
}

export interface LongTask {
  duration: number;
  startTime: number;
  attribution?: string;
}

export interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  percentage: number;
}

export interface NetworkInfo {
  effectiveType?: string; // '4g', '3g', '2g', 'slow-2g'
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

export interface PerformanceReport {
  webVitals: WebVitals;
  resources: ResourceTiming[];
  longTasks: LongTask[];
  memory?: MemoryInfo;
  network?: NetworkInfo;
  timestamp: number;
}

export interface PerformanceConfig {
  enabled?: boolean;
  trackWebVitals?: boolean;
  trackResources?: boolean;
  trackLongTasks?: boolean;
  trackMemory?: boolean;
  trackNetwork?: boolean;
  sampleRate?: number; // 0-1
  reportInterval?: number; // milliseconds
  longTaskThreshold?: number; // milliseconds
  onReport?: (report: PerformanceReport) => void;
}

export interface PerformanceBudget {
  LCP?: number;
  FID?: number;
  CLS?: number;
  FCP?: number;
  TTFB?: number;
}

// ============================================================================
// WEB VITALS TRACKER
// ============================================================================

class WebVitalsTracker {
  private vitals: WebVitals = {};
  private observers: Map<string, PerformanceObserver> = new Map();

  async track(): Promise<WebVitals> {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return this.vitals;
    }

    await Promise.all([
      this.trackLCP(),
      this.trackFID(),
      this.trackCLS(),
      this.trackFCP(),
      this.trackTTFB()
    ]);

    return this.vitals;
  }

  private trackLCP(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.vitals.LCP = lastEntry.renderTime || lastEntry.loadTime;
        });

        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', observer);

        // LCP should be captured within 2.5s
        setTimeout(() => {
          observer.disconnect();
          resolve();
        }, 2500);
      } catch (error) {
        resolve();
      }
    });
  }

  private trackFID(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstInput = entries[0] as any;
          this.vitals.FID = firstInput.processingStart - firstInput.startTime;
          observer.disconnect();
          resolve();
        });

        observer.observe({ entryTypes: ['first-input'] });
        this.observers.set('fid', observer);

        // FID should be captured within 5s
        setTimeout(() => {
          observer.disconnect();
          resolve();
        }, 5000);
      } catch (error) {
        resolve();
      }
    });
  }

  private trackCLS(): Promise<void> {
    return new Promise((resolve) => {
      try {
        let clsScore = 0;

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
              this.vitals.CLS = clsScore;
            }
          }
        });

        observer.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('cls', observer);

        // CLS is measured throughout the page lifecycle
        setTimeout(() => {
          observer.disconnect();
          resolve();
        }, 5000);
      } catch (error) {
        resolve();
      }
    });
  }

  private trackFCP(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            this.vitals.FCP = fcpEntry.startTime;
            observer.disconnect();
            resolve();
          }
        });

        observer.observe({ entryTypes: ['paint'] });
        this.observers.set('fcp', observer);

        setTimeout(() => {
          observer.disconnect();
          resolve();
        }, 3000);
      } catch (error) {
        resolve();
      }
    });
  }

  private trackTTFB(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navTiming) {
          this.vitals.TTFB = navTiming.responseStart - navTiming.requestStart;
        }
        resolve();
      } catch (error) {
        resolve();
      }
    });
  }

  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }

  getVitals(): WebVitals {
    return { ...this.vitals };
  }
}

// ============================================================================
// RESOURCE TIMING TRACKER
// ============================================================================

class ResourceTimingTracker {
  track(): ResourceTiming[] {
    if (typeof window === 'undefined' || !performance.getEntriesByType) {
      return [];
    }

    try {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      return resources.map(resource => ({
        name: resource.name,
        duration: resource.duration,
        size: resource.transferSize,
        type: this.getResourceType(resource),
        startTime: resource.startTime
      }));
    } catch (error) {
      return [];
    }
  }

  private getResourceType(resource: PerformanceResourceTiming): string {
    const url = resource.name.toLowerCase();
    
    if (url.match(/\.(js|mjs)$/)) return 'script';
    if (url.match(/\.css$/)) return 'stylesheet';
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'font';
    if (url.match(/\.(mp4|webm|ogg)$/)) return 'video';
    if (resource.initiatorType === 'xmlhttprequest' || resource.initiatorType === 'fetch') return 'xhr';
    
    return resource.initiatorType || 'other';
  }

  clear(): void {
    if (typeof performance !== 'undefined' && performance.clearResourceTimings) {
      performance.clearResourceTimings();
    }
  }
}

// ============================================================================
// LONG TASK TRACKER
// ============================================================================

class LongTaskTracker {
  private tasks: LongTask[] = [];
  private observer?: PerformanceObserver;
  private threshold: number;

  constructor(threshold: number = 50) {
    this.threshold = threshold;
  }

  start(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (entry.duration > this.threshold) {
            this.tasks.push({
              duration: entry.duration,
              startTime: entry.startTime,
              attribution: entry.attribution?.[0]?.name
            });
          }
        }
      });

      this.observer.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      // Long task API not supported
    }
  }

  stop(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }

  getTasks(): LongTask[] {
    return [...this.tasks];
  }

  clear(): void {
    this.tasks = [];
  }
}

// ============================================================================
// MEMORY TRACKER
// ============================================================================

class MemoryTracker {
  track(): MemoryInfo | undefined {
    if (typeof window === 'undefined') return undefined;

    try {
      const memory = (performance as any).memory;
      if (!memory) return undefined;

      const percentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        percentage: parseFloat(percentage.toFixed(2))
      };
    } catch (error) {
      return undefined;
    }
  }
}

// ============================================================================
// NETWORK TRACKER
// ============================================================================

class NetworkTracker {
  track(): NetworkInfo | undefined {
    if (typeof window === 'undefined' || !(navigator as any).connection) {
      return undefined;
    }

    try {
      const conn = (navigator as any).connection;
      
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData
      };
    } catch (error) {
      return undefined;
    }
  }
}

// ============================================================================
// PERFORMANCE SERVICE CLASS
// ============================================================================

export class PerformanceService {
  private static instance: PerformanceService;
  
  private config: Required<PerformanceConfig>;
  private webVitalsTracker: WebVitalsTracker;
  private resourceTimingTracker: ResourceTimingTracker;
  private longTaskTracker: LongTaskTracker;
  private memoryTracker: MemoryTracker;
  private networkTracker: NetworkTracker;
  private reportTimer?: ReturnType<typeof setInterval>;
  private customMarks: Map<string, number> = new Map();

  private constructor(config: PerformanceConfig = {}) {
    this.config = {
      enabled: true,
      trackWebVitals: true,
      trackResources: true,
      trackLongTasks: true,
      trackMemory: true,
      trackNetwork: true,
      sampleRate: 1.0,
      reportInterval: 60000, // 1 minute
      longTaskThreshold: 50,
      onReport: () => {},
      ...config
    };

    this.webVitalsTracker = new WebVitalsTracker();
    this.resourceTimingTracker = new ResourceTimingTracker();
    this.longTaskTracker = new LongTaskTracker(this.config.longTaskThreshold);
    this.memoryTracker = new MemoryTracker();
    this.networkTracker = new NetworkTracker();

    if (this.shouldTrack()) {
      this.initialize();
    }
  }

  static getInstance(config?: PerformanceConfig): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService(config);
    }
    return PerformanceService.instance;
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  private initialize(): void {
    // Track Web Vitals
    if (this.config.trackWebVitals) {
      this.webVitalsTracker.track();
    }

    // Start long task tracking
    if (this.config.trackLongTasks) {
      this.longTaskTracker.start();
    }

    // Setup periodic reporting
    if (this.config.reportInterval > 0) {
      this.startReporting();
    }

    // Report on page visibility change
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.report();
        }
      });
    }

    // Report before unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.report();
      });
    }
  }

  // ============================================================================
  // PERFORMANCE MARKS & MEASURES
  // ============================================================================

  /**
   * Create a performance mark
   */
  mark(name: string): void {
    if (!this.config.enabled) return;

    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name);
      this.customMarks.set(name, Date.now());
    }
  }

  /**
   * Measure between two marks
   */
  measure(name: string, startMark: string, endMark?: string): number | undefined {
    if (!this.config.enabled) return undefined;

    try {
      if (typeof performance !== 'undefined' && performance.measure) {
        if (endMark) {
          performance.measure(name, startMark, endMark);
        } else {
          performance.measure(name, startMark);
        }

        const measure = performance.getEntriesByName(name, 'measure')[0];
        return measure ? measure.duration : undefined;
      }
    } catch (error) {
      console.warn('[Performance] Measure failed:', error);
    }

    return undefined;
  }

  /**
   * Clear marks and measures
   */
  clearMarks(name?: string): void {
    if (typeof performance !== 'undefined') {
      if (name) {
        performance.clearMarks(name);
        this.customMarks.delete(name);
      } else {
        performance.clearMarks();
        this.customMarks.clear();
      }
    }
  }

  // ============================================================================
  // TIMING UTILITIES
  // ============================================================================

  /**
   * Time a function execution
   */
  async time<T>(name: string, fn: () => T | Promise<T>): Promise<T> {
    this.mark(`${name}_start`);
    
    try {
      const result = await fn();
      this.mark(`${name}_end`);
      this.measure(name, `${name}_start`, `${name}_end`);
      return result;
    } catch (error) {
      this.mark(`${name}_end`);
      this.measure(name, `${name}_start`, `${name}_end`);
      throw error;
    }
  }

  /**
   * Start a timer
   */
  startTimer(name: string): { stop: () => number } {
    const startMark = `${name}_start_${Date.now()}`;
    this.mark(startMark);

    return {
      stop: () => {
        const endMark = `${name}_end_${Date.now()}`;
        this.mark(endMark);
        return this.measure(name, startMark, endMark) || 0;
      }
    };
  }

  // ============================================================================
  // REPORTING
  // ============================================================================

  /**
   * Generate performance report
   */
  async getReport(): Promise<PerformanceReport> {
    const report: PerformanceReport = {
      webVitals: {},
      resources: [],
      longTasks: [],
      timestamp: Date.now()
    };

    // Web Vitals
    if (this.config.trackWebVitals) {
      report.webVitals = this.webVitalsTracker.getVitals();
    }

    // Resource Timing
    if (this.config.trackResources) {
      report.resources = this.resourceTimingTracker.track();
    }

    // Long Tasks
    if (this.config.trackLongTasks) {
      report.longTasks = this.longTaskTracker.getTasks();
    }

    // Memory
    if (this.config.trackMemory) {
      report.memory = this.memoryTracker.track();
    }

    // Network
    if (this.config.trackNetwork) {
      report.network = this.networkTracker.track();
    }

    return report;
  }

  /**
   * Report performance data
   */
  async report(): Promise<void> {
    if (!this.shouldTrack()) return;

    try {
      const report = await this.getReport();
      
      if (this.config.onReport) {
        this.config.onReport(report);
      }

      // Clear collected data
      this.resourceTimingTracker.clear();
      this.longTaskTracker.clear();
    } catch (error) {
      console.error('[Performance] Report failed:', error);
    }
  }

  private startReporting(): void {
    this.stopReporting();

    this.reportTimer = setInterval(() => {
      this.report();
    }, this.config.reportInterval);
  }

  private stopReporting(): void {
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
      this.reportTimer = undefined;
    }
  }

  // ============================================================================
  // PERFORMANCE BUDGETS
  // ============================================================================

  /**
   * Check if performance meets budget
   */
  async checkBudget(budget: PerformanceBudget): Promise<{
    passed: boolean;
    violations: Array<{ metric: string; actual: number; budget: number }>;
  }> {
    const vitals = await this.webVitalsTracker.track();
    const violations: Array<{ metric: string; actual: number; budget: number }> = [];

    Object.entries(budget).forEach(([metric, limit]) => {
      const actual = vitals[metric as keyof WebVitals];
      if (actual !== undefined && actual > limit) {
        violations.push({
          metric,
          actual,
          budget: limit
        });
      }
    });

    return {
      passed: violations.length === 0,
      violations
    };
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  private shouldTrack(): boolean {
    if (!this.config.enabled) return false;
    if (this.config.sampleRate >= 1.0) return true;
    return Math.random() < this.config.sampleRate;
  }

  /**
   * Get navigation timing
   */
  getNavigationTiming(): PerformanceNavigationTiming | undefined {
    if (typeof performance === 'undefined') return undefined;

    try {
      return performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...config };

    if (config.reportInterval !== undefined) {
      this.startReporting();
    }
  }

  /**
   * Cleanup and stop tracking
   */
  destroy(): void {
    this.stopReporting();
    this.webVitalsTracker.disconnect();
    this.longTaskTracker.stop();
    this.customMarks.clear();
  }
}

// ============================================================================
// SINGLETON INSTANCE & EXPORTS
// ============================================================================

export const performanceService = PerformanceService.getInstance();

export const mark = (name: string) => performanceService.mark(name);
export const measure = (name: string, startMark: string, endMark?: string) => 
  performanceService.measure(name, startMark, endMark);
export const time = <T>(name: string, fn: () => T | Promise<T>) => 
  performanceService.time(name, fn);

export default performanceService;