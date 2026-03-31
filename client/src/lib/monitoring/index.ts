/**
 * @fileoverview Monitoring Module - Main Entry Point
 * @module lib/monitoring
 * @description Complete monitoring system with metrics, analytics, and performance tracking
 * 
 * @example
 * ```typescript
 * // Metrics
 * import { metrics } from '../../lib/monitoring';
 * 
 * metrics.incrementCounter('api.requests');
 * metrics.recordTiming('api.latency', 150);
 * 
 * // Analytics
 * import { analytics } from '../../lib/monitoring';
 * 
 * analytics.track('button_clicked', { button: 'signup' });
 * analytics.page('/home', 'Home Page');
 * analytics.identify('user123', { email: 'user@example.com' });
 * 
 * // Performance
 * import { performanceService } from '../../lib/monitoring';
 * 
 * performanceService.mark('api_start');
 * // ... do work
 * performanceService.mark('api_end');
 * performanceService.measure('api_call', 'api_start', 'api_end');
 * ```
 * 
 * @version 2.0.0
 */

// ============================================================================
// METRICS EXPORTS
// ============================================================================

export {
  metrics,
  createMetrics,
  Metrics,
  type MetricsType,
  type MetricType,
  type MetricValue,
  type Counter,
  type Gauge,
  type Histogram,
  type Timing,
  type MetricsSnapshot,
  type MetricsConfig,
  type MetricsBackend,
  ConsoleBackend,
  HttpBackend,
  WindowStorageBackend
} from './metrics.service';

// ============================================================================
// ANALYTICS EXPORTS
// ============================================================================

export {
  analytics,
  track,
  page,
  identify,
  reset,
  AnalyticsService,
  ConsoleProvider,
  GoogleAnalyticsProvider,
  type AnalyticsEvent,
  type PageView,
  type UserIdentity,
  type AnalyticsConfig,
  type AnalyticsProvider
} from './analytics.service';

// ============================================================================
// PERFORMANCE EXPORTS
// ============================================================================

export {
  performanceService,
  mark,
  measure,
  time,
  PerformanceService,
  type WebVitals,
  type ResourceTiming,
  type LongTask,
  type MemoryInfo,
  type NetworkInfo,
  type PerformanceReport,
  type PerformanceConfig,
  type PerformanceBudget
} from './performance.service';

// ============================================================================
// RE-EXPORT DEFAULTS
// ============================================================================

import { metrics, ConsoleBackend, HttpBackend } from './metrics.service';
import { analytics } from './analytics.service';
import { performanceService } from './performance.service';

/**
 * Default monitoring instance
 */
export default {
  metrics,
  analytics,
  performance: performanceService
};

// ============================================================================
// UNIFIED MONITORING API
// ============================================================================

/**
 * Complete monitoring interface
 */
export const monitoring = {
  // Metrics
  metrics: {
    increment: (name: string, value?: number, tags?: Record<string, string>) => 
      metrics.incrementCounter(name, value, tags),
    
    decrement: (name: string, value?: number, tags?: Record<string, string>) => 
      metrics.decrementCounter(name, value, tags),
    
    gauge: (name: string, value: number, tags?: Record<string, string>) => 
      metrics.setGauge(name, value, tags),
    
    timing: (name: string, duration: number) => 
      metrics.recordTiming(name, duration),
    
    histogram: (name: string, value: number) => 
      metrics.recordHistogram(name, value),
    
    time: <T>(name: string, fn: () => T | Promise<T>) => 
      metrics.time(name, fn),
    
    startTimer: (name: string) => 
      metrics.startTimer(name),
    
    getSnapshot: () => 
      metrics.getSnapshot(),
    
    flush: () => 
      metrics.flush()
  },

  // Analytics
  analytics: {
    track: (eventName: string, properties?: Record<string, any>) => 
      analytics.track(eventName, properties),
    
    page: (path?: string, title?: string, properties?: Record<string, any>) => 
      analytics.page(path, title, properties),
    
    identify: (userId: string, traits?: Record<string, any>) => 
      analytics.identify(userId, traits),
    
    reset: () => 
      analytics.reset(),
    
    trackClick: (buttonName: string, properties?: Record<string, any>) => 
      analytics.trackClick(buttonName, properties),
    
    trackFormSubmit: (formName: string, properties?: Record<string, any>) => 
      analytics.trackFormSubmit(formName, properties),
    
    trackSearch: (query: string, properties?: Record<string, any>) => 
      analytics.trackSearch(query, properties),
    
    trackPurchase: (amount: number, properties?: Record<string, any>) => 
      analytics.trackPurchase(amount, properties),
    
    trackSignup: (method?: string, properties?: Record<string, any>) => 
      analytics.trackSignup(method, properties),
    
    trackLogin: (method?: string, properties?: Record<string, any>) => 
      analytics.trackLogin(method, properties)
  },

  // Performance
  performance: {
    mark: (name: string) => 
      performanceService.mark(name),
    
    measure: (name: string, startMark: string, endMark?: string) => 
      performanceService.measure(name, startMark, endMark),
    
    time: <T>(name: string, fn: () => T | Promise<T>) => 
      performanceService.time(name, fn),
    
    startTimer: (name: string) => 
      performanceService.startTimer(name),
    
    getReport: () => 
      performanceService.getReport(),
    
    checkBudget: (budget: import('./performance.service').PerformanceBudget) => 
      performanceService.checkBudget(budget)
  }
};

// ============================================================================
// INITIALIZATION HELPER
// ============================================================================

/**
 * Initialize all monitoring services
 */
export const initializeMonitoring = (config?: {
  metrics?: Partial<import('./metrics.service').MetricsConfig>;
  analytics?: Partial<import('./analytics.service').AnalyticsConfig>;
  performance?: Partial<import('./performance.service').PerformanceConfig>;
}) => {
  if (config?.metrics) {
    metrics.updateConfig(config.metrics);
  }

  if (config?.analytics) {
    analytics.updateConfig(config.analytics);
  }

  if (config?.performance) {
    performanceService.updateConfig(config.performance);
  }

  return monitoring;
};

// ============================================================================
// MONITORING PRESETS
// ============================================================================

/**
 * Development monitoring configuration
 */
export const developmentMonitoring = () => {
  return initializeMonitoring({
    metrics: {
      enabled: true,
      backends: [new ConsoleBackend()]
    },
    analytics: {
      enabled: true,
      debug: true,
      trackPageViews: true,
      trackClicks: true
    },
    performance: {
      enabled: true,
      trackWebVitals: true,
      trackResources: true,
      trackLongTasks: true,
      trackMemory: true
    }
  });
};

/**
 * Production monitoring configuration
 */
export const productionMonitoring = (config: {
  metricsEndpoint?: string;
  analyticsProviders?: import('./analytics.service').AnalyticsProvider[];
  performanceEndpoint?: string;
}) => {
  const backends: import('./metrics.service').MetricsBackend[] = [];
  
  if (config.metricsEndpoint) {
    backends.push(
      new HttpBackend(config.metricsEndpoint)
    );
  }

  return initializeMonitoring({
    metrics: {
      enabled: true,
      backends,
      flushInterval: 60000 // 1 minute
    },
    analytics: {
      enabled: true,
      debug: false,
      providers: config.analyticsProviders || [],
      trackPageViews: true,
      respectDoNotTrack: true
    },
    performance: {
      enabled: true,
      trackWebVitals: true,
      sampleRate: 0.1, // 10% sampling
      reportInterval: 300000, // 5 minutes
      onReport: config.performanceEndpoint 
        ? async (report) => {
            try {
              await fetch(config.performanceEndpoint!, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(report)
              });
            } catch (error) {
              console.error('[Monitoring] Failed to send performance report:', error);
            }
          }
        : undefined
    }
  });
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Track API call with metrics and analytics
 */
export const trackApiCall = async <T>(
  endpoint: string,
  method: string,
  fn: () => Promise<T>
): Promise<T> => {
  const metricName = `api.${method.toLowerCase()}.${endpoint.replace(/\//g, '.')}`;
  
  metrics.incrementCounter(`${metricName}.requests`);
  
  const timer = metrics.startTimer(`${metricName}.duration`);
  
  try {
    const result = await fn();
    
    metrics.incrementCounter(`${metricName}.success`);
    analytics.track('api_call', {
      endpoint,
      method,
      status: 'success',
      duration: timer.stop()
    });
    
    return result;
  } catch (error) {
    metrics.incrementCounter(`${metricName}.error`);
    analytics.track('api_error', {
      endpoint,
      method,
      error: (error as Error).message,
      duration: timer.stop()
    });
    throw error;
  }
};

/**
 * Track page transition with all monitoring
 */
export const trackPageTransition = (
  from: string,
  to: string,
  duration: number
) => {
  // Metrics
  metrics.recordTiming('page.transition', duration);
  metrics.incrementCounter('page.views');
  
  // Analytics
  analytics.page(to);
  analytics.track('page_transition', {
    from,
    to,
    duration
  });
  
  // Performance
  performanceService.mark(`page_${to}`);
};

/**
 * Track user action with monitoring
 */
export const trackUserAction = (
  action: string,
  properties?: Record<string, any>
) => {
  // Metrics
  metrics.incrementCounter(`user.actions.${action}`);
  
  // Analytics
  analytics.track(action, properties);
};

/**
 * Track error with all monitoring
 */
export const trackError = (
  error: Error,
  context?: Record<string, any>
) => {
  // Metrics
  metrics.incrementCounter('errors.total');
  metrics.incrementCounter(`errors.${error.name}`);
  
  // Analytics
  analytics.track('error', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...context
  });
};

// ============================================================================
// DEBUGGING HELPERS
// ============================================================================

/**
 * Log current monitoring state
 */
export const logMonitoringState = () => {
  console.group('📊 Monitoring State');
  
  console.log('Metrics:', metrics.getSummary());
  console.log('Analytics Session:', analytics.getSessionId());
  console.log('Analytics User:', analytics.getUserId());
  
  performanceService.getReport().then(report => {
    console.log('Performance:', report);
  });
  
  console.groupEnd();
};

/**
 * Clear all monitoring data
 */
export const clearMonitoringData = () => {
  metrics.reset();
  analytics.reset();
  performanceService.clearMarks();
  console.log('[Monitoring] All data cleared');
};

// ============================================================================
// REACT HOOKS (Optional - if using React)
// ============================================================================

/**
 * Hook to track component mount
 */
export const useComponentTracking = (componentName: string) => {
  if (typeof window === 'undefined') return;

  // Track mount
  performanceService.mark(`${componentName}_mount`);
  analytics.track('component_mount', { component: componentName });

  // Track unmount (return cleanup function)
  return () => {
    performanceService.mark(`${componentName}_unmount`);
    performanceService.measure(
      `${componentName}_lifetime`,
      `${componentName}_mount`,
      `${componentName}_unmount`
    );
    analytics.track('component_unmount', { component: componentName });
  };
};

/**
 * Hook to track page view
 */
export const usePageTracking = (path: string, title?: string) => {
  if (typeof window === 'undefined') return;

  analytics.page(path, title);
  metrics.incrementCounter('page.views');
  performanceService.mark(`page_${path}`);
};

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if monitoring is enabled
 */
export const isMonitoringEnabled = (): boolean => {
  return (
    metrics.getConfig().enabled &&
    analytics.getSessionId() !== null
  );
};

/**
 * Check if in development mode
 */
export const isDevelopment = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
  }
  return false;
};