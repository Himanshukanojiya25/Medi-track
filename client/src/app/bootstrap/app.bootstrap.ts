/**
 * @fileoverview Application Bootstrap Module
 * @module app/bootstrap/app.bootstrap
 * @description Enterprise-grade application initialization system with:
 * - Graceful error handling and recovery
 * - Retry mechanisms for transient failures
 * - Performance monitoring and metrics
 * - Health checks and diagnostics
 * - Progressive enhancement
 * - Zero-downtime initialization
 * 
 * @version 2.0.0
 * @author Your SaaS Platform
 */

import { bootstrapEnv } from './env.bootstrap';
import { bootstrapAnalytics } from './analytics.bootstrap';
import { bootstrapFeatureFlags } from './feature-flags.bootstrap';
import { bootstrapAI } from './ai.bootstrap';
import { bootstrapSecurity } from './security.bootstrap';
import { bootstrapPerformance } from './performance.bootstrap';
import { logger } from '../../utils/logger/logger.util';
import * as monitoringModule from '../../lib/monitoring';
import { cache } from '../../lib/cache';
import { config } from '../config/app.config';

// Handle both default and named exports from monitoring
const metrics = 'default' in monitoringModule 
  ? (monitoringModule as any).default 
  : monitoringModule.metrics || monitoringModule;

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type ModuleName = 'env' | 'security' | 'features' | 'analytics' | 'ai' | 'performance';

type ModulePriority = 'critical' | 'high' | 'medium' | 'low';

interface ModuleConfig {
  name: ModuleName;
  priority: ModulePriority;
  timeout: number;
  retries: number;
  required: boolean;
  dependencies?: ModuleName[];
}

interface ModuleStatus {
  initialized: boolean;
  attempts: number;
  lastError?: Error;
  duration?: number;
  startTime?: number;
  endTime?: number;
}

interface AppBootStatus {
  initialized: boolean;
  healthy: boolean;
  modules: Record<ModuleName, ModuleStatus>;
  errors: Record<string, Error>;
  warnings: string[];
  startTime: number;
  endTime?: number;
  bootId: string;
  version: string;
  environment: string;
}

interface BootstrapOptions {
  force?: boolean;
  skipOptional?: boolean;
  verbose?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const BOOT_TIMEOUT = 30000; // 30 seconds total
const MODULE_TIMEOUT = 10000; // 10 seconds per module
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const MODULE_CONFIGS: Record<ModuleName, ModuleConfig> = {
  env: {
    name: 'env',
    priority: 'critical',
    timeout: 5000,
    retries: 2,
    required: true,
    dependencies: []
  },
  security: {
    name: 'security',
    priority: 'critical',
    timeout: 5000,
    retries: 2,
    required: true,
    dependencies: ['env']
  },
  features: {
    name: 'features',
    priority: 'critical',
    timeout: 8000,
    retries: 3,
    required: true,
    dependencies: ['env']
  },
  performance: {
    name: 'performance',
    priority: 'high',
    timeout: 5000,
    retries: 2,
    required: false,
    dependencies: ['env']
  },
  analytics: {
    name: 'analytics',
    priority: 'medium',
    timeout: 8000,
    retries: 3,
    required: false,
    dependencies: ['env', 'features']
  },
  ai: {
    name: 'ai',
    priority: 'low',
    timeout: 10000,
    retries: 3,
    required: false,
    dependencies: ['env', 'features']
  }
};

// ============================================================================
// BOOTSTRAP CLASS
// ============================================================================

class AppBootstrapper {
  private static instance: AppBootstrapper;
  
  private status: AppBootStatus = {
    initialized: false,
    healthy: false,
    modules: this.initializeModuleStatus(),
    errors: {},
    warnings: [],
    startTime: 0,
    bootId: '',
    version: config.version,
    environment: config.environment
  };

  private isBootstrapping = false;
  private bootstrapPromise?: Promise<void>;

  // ============================================================================
  // SINGLETON PATTERN
  // ============================================================================

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): AppBootstrapper {
    if (!AppBootstrapper.instance) {
      AppBootstrapper.instance = new AppBootstrapper();
    }
    return AppBootstrapper.instance;
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Main bootstrap method - idempotent and thread-safe
   */
  async bootstrap(options: BootstrapOptions = {}): Promise<void> {
    // Prevent multiple simultaneous bootstraps
    if (this.isBootstrapping) {
      logger.warn('[APP BOOTSTRAP] Bootstrap already in progress, waiting...');
      return this.bootstrapPromise;
    }

    // Already initialized
    if (this.status.initialized && !options.force) {
      logger.info('[APP BOOTSTRAP] Application already initialized');
      return;
    }

    this.isBootstrapping = true;
    this.bootstrapPromise = this.executeBootstrap(options);

    try {
      await this.bootstrapPromise;
    } finally {
      this.isBootstrapping = false;
      this.bootstrapPromise = undefined;
    }
  }

  /**
   * Get current bootstrap status
   */
  getStatus(): Readonly<AppBootStatus> {
    return Object.freeze({ ...this.status });
  }

  /**
   * Check if app is ready to serve users
   */
  isReady(): boolean {
    return this.status.initialized && this.status.healthy;
  }

  /**
   * Get health check data
   */
  getHealthCheck(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Record<string, boolean>;
    timestamp: number;
  } {
    const criticalModules = Object.entries(MODULE_CONFIGS)
      .filter(([_, config]) => config.required)
      .map(([name]) => name as ModuleName);

    const criticalHealthy = criticalModules.every(
      name => this.status.modules[name]?.initialized
    );

    const allHealthy = Object.values(this.status.modules).every(
      mod => mod.initialized
    );

    return {
      status: criticalHealthy ? (allHealthy ? 'healthy' : 'degraded') : 'unhealthy',
      checks: Object.fromEntries(
        Object.entries(this.status.modules).map(([name, status]) => [
          name,
          status.initialized
        ])
      ),
      timestamp: Date.now()
    };
  }

  // ============================================================================
  // PRIVATE METHODS - BOOTSTRAP EXECUTION
  // ============================================================================

  private async executeBootstrap(options: BootstrapOptions): Promise<void> {
    this.status.startTime = Date.now();
    this.status.bootId = this.generateBootId();
    this.status.errors = {};
    this.status.warnings = [];

    logger.info('[APP BOOTSTRAP] 🚀 Starting application initialization', {
      component: 'App',
      bootId: this.status.bootId,
      version: config.version,
      environment: config.environment,
      options
    });

    metrics.incrementCounter('app.bootstrap.start');

    try {
      // Set global timeout
      await this.withTimeout(
        this.runBootstrapSequence(options),
        BOOT_TIMEOUT,
        'Global bootstrap timeout'
      );

      this.status.initialized = true;
      this.status.healthy = this.calculateHealthStatus();
      this.status.endTime = Date.now();

      const duration = this.status.endTime - this.status.startTime;

      metrics.recordTiming('app.bootstrap.duration', duration);
      metrics.incrementCounter('app.bootstrap.success');

      logger.info('[APP BOOTSTRAP] ✅ Application initialized successfully', {
        component: 'App',
        bootId: this.status.bootId,
        duration,
        healthy: this.status.healthy,
        modules: this.getModuleSummary()
      });

      // Background tasks (non-blocking)
      this.performPostBootstrapTasks().catch(error => {
        logger.warn('[APP BOOTSTRAP] Post-bootstrap tasks failed', { error });
      });

    } catch (error) {
      await this.handleBootstrapFailure(error);
      throw error;
    }
  }

  private async runBootstrapSequence(options: BootstrapOptions): Promise<void> {
    // Sort modules by priority and dependencies
    const sortedModules = this.getSortedModules();

    logger.info('[APP BOOTSTRAP] Module execution order', {
      modules: sortedModules.map(m => m.name)
    });

    // Bootstrap modules in order
    for (const moduleConfig of sortedModules) {
      if (options.skipOptional && !moduleConfig.required) {
        logger.info(`[APP BOOTSTRAP] Skipping optional module: ${moduleConfig.name}`);
        continue;
      }

      await this.bootstrapModule(moduleConfig, options);
    }

    // Verify critical modules
    this.verifyCriticalModules();
  }

  private async bootstrapModule(
    moduleConfig: ModuleConfig,
    options: BootstrapOptions
  ): Promise<void> {
    const { name, timeout, retries, required } = moduleConfig;
    const moduleStatus = this.status.modules[name];

    moduleStatus.startTime = Date.now();

    logger.info(`[APP BOOTSTRAP] 🔄 Initializing ${name} module`, {
      component: 'App',
      module: name,
      priority: moduleConfig.priority,
      required
    });

    try {
      // Execute with retries
      await this.withRetry(
        async () => {
          await this.withTimeout(
            this.executeModule(name),
            timeout,
            `${name} module timeout`
          );
        },
        retries,
        name
      );

      moduleStatus.initialized = true;
      moduleStatus.endTime = Date.now();
      moduleStatus.duration = moduleStatus.endTime - moduleStatus.startTime!;

      logger.info(`[APP BOOTSTRAP] ✅ ${name} module initialized`, {
        component: 'App',
        module: name,
        duration: moduleStatus.duration,
        attempts: moduleStatus.attempts
      });

      metrics.recordTiming(`app.bootstrap.module.${name}`, moduleStatus.duration);
      metrics.incrementCounter(`app.bootstrap.module.${name}.success`);

    } catch (error) {
      moduleStatus.lastError = error as Error;
      moduleStatus.endTime = Date.now();
      moduleStatus.duration = moduleStatus.endTime - moduleStatus.startTime!;

      this.status.errors[name] = error as Error;

      logger.error(`[APP BOOTSTRAP] ❌ ${name} module failed`, {
        component: 'App',
        module: name,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        duration: moduleStatus.duration,
        attempts: moduleStatus.attempts
      });

      metrics.incrementCounter(`app.bootstrap.module.${name}.failure`);

      // Critical modules must succeed
      if (required) {
        throw new Error(
          `Critical module "${name}" failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      } else {
        // Optional modules can fail gracefully
        this.status.warnings.push(
          `Optional module "${name}" failed but application will continue`
        );
      }
    }
  }

  private async executeModule(name: ModuleName): Promise<void> {
    const moduleStatus = this.status.modules[name];
    moduleStatus.attempts++;

    switch (name) {
      case 'env':
        await bootstrapEnv();
        break;
      case 'security':
        await bootstrapSecurity();
        break;
      case 'features':
        await bootstrapFeatureFlags();
        break;
      case 'performance':
        await bootstrapPerformance();
        break;
      case 'analytics':
        await bootstrapAnalytics();
        break;
      case 'ai':
        await bootstrapAI();
        break;
      default:
        throw new Error(`Unknown module: ${name}`);
    }
  }

  // ============================================================================
  // PRIVATE METHODS - UTILITIES
  // ============================================================================

  private initializeModuleStatus(): Record<ModuleName, ModuleStatus> {
    return Object.fromEntries(
      Object.keys(MODULE_CONFIGS).map(name => [
        name,
        {
          initialized: false,
          attempts: 0
        }
      ])
    ) as Record<ModuleName, ModuleStatus>;
  }

  private getSortedModules(): ModuleConfig[] {
    const modules = Object.values(MODULE_CONFIGS);
    const sorted: ModuleConfig[] = [];
    const visited = new Set<ModuleName>();

    const visit = (module: ModuleConfig) => {
      if (visited.has(module.name)) return;
      visited.add(module.name);

      // Visit dependencies first
      if (module.dependencies) {
        for (const depName of module.dependencies) {
          const dep = MODULE_CONFIGS[depName];
          if (dep) visit(dep);
        }
      }

      sorted.push(module);
    };

    // Sort by priority first
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    modules
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
      .forEach(visit);

    return sorted;
  }

  private verifyCriticalModules(): void {
    const criticalModules = Object.entries(MODULE_CONFIGS)
      .filter(([_, config]) => config.required)
      .map(([name]) => name as ModuleName);

    const failedCritical = criticalModules.filter(
      name => !this.status.modules[name]?.initialized
    );

    if (failedCritical.length > 0) {
      throw new Error(
        `Critical modules failed: ${failedCritical.join(', ')}`
      );
    }
  }

  private calculateHealthStatus(): boolean {
    const criticalModules = Object.entries(MODULE_CONFIGS)
      .filter(([_, config]) => config.required)
      .map(([name]) => name as ModuleName);

    return criticalModules.every(
      name => this.status.modules[name]?.initialized
    );
  }

  private getModuleSummary(): Record<string, string> {
    return Object.fromEntries(
      Object.entries(this.status.modules).map(([name, status]) => [
        name,
        status.initialized ? '✅' : '❌'
      ])
    );
  }

  private async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    errorMessage: string
  ): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout>;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(errorMessage));
      }, timeoutMs);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      clearTimeout(timeoutId!);
    }
  }

  private async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number,
    context: string
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxRetries) {
          const delay = RETRY_DELAY * attempt;
          logger.warn(`[APP BOOTSTRAP] Retry ${attempt}/${maxRetries} for ${context}`, {
            error: lastError.message,
            nextRetryIn: delay
          });
          await this.sleep(delay);
        }
      }
    }

    throw lastError!;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateBootId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const instanceId = config.instanceId || 'unknown';
    return `boot-${timestamp}-${random}-${instanceId}`;
  }

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  private async handleBootstrapFailure(error: any): Promise<void> {
    this.status.endTime = Date.now();
    this.status.initialized = false;
    this.status.healthy = false;

    const duration = this.status.endTime - this.status.startTime;

    metrics.incrementCounter('app.bootstrap.failure');
    metrics.recordTiming('app.bootstrap.failure_duration', duration);

    logger.error('[APP BOOTSTRAP] 💥 Application initialization failed', {
      component: 'App',
      bootId: this.status.bootId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration,
      modules: this.getModuleSummary(),
      errors: Object.keys(this.status.errors)
    });

    // Show user-friendly error in production
    if (config.environment === 'production') {
      this.showFatalError(error);
    }

    // Try to send error to monitoring (best effort)
    try {
      await this.reportBootstrapFailure(error);
    } catch (reportError) {
      logger.error('[APP BOOTSTRAP] Failed to report bootstrap failure', {
        error: reportError
      });
    }
  }

  private setupGlobalErrorHandlers(): void {
    if (typeof window !== 'undefined') {
      // Unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        logger.error('[APP BOOTSTRAP] Unhandled promise rejection', {
          reason: event.reason,
          promise: event.promise
        });
        metrics.incrementCounter('app.unhandled_rejection');
      });

      // Global errors
      window.addEventListener('error', (event) => {
        logger.error('[APP BOOTSTRAP] Global error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error
        });
        metrics.incrementCounter('app.global_error');
      });
    }
  }

  private showFatalError(error: any): void {
    if (typeof document === 'undefined') return;

    const overlay = document.createElement('div');
    overlay.id = 'app-fatal-error';
    overlay.setAttribute('role', 'alert');
    overlay.setAttribute('aria-live', 'assertive');
    
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      animation: fadeIn 0.3s ease-in;
    `;

    const errorCode = this.status.bootId.split('-')[1] || 'UNKNOWN';

    overlay.innerHTML = `
      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .error-icon {
          animation: pulse 2s ease-in-out infinite;
        }
      </style>
      <div style="
        max-width: 560px;
        background: white;
        border-radius: 16px;
        padding: 48px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        text-align: center;
      ">
        <div class="error-icon" style="font-size: 64px; margin-bottom: 24px;">
          ⚠️
        </div>
        <h1 style="
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 16px 0;
          color: #1f2937;
        ">
          Unable to Start Application
        </h1>
        <p style="
          font-size: 16px;
          line-height: 1.6;
          color: #6b7280;
          margin: 0 0 32px 0;
        ">
          We encountered an issue while initializing the application.
          Please try refreshing the page. If the problem persists, contact our support team.
        </p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button onclick="location.reload()" style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.4)'" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.4)'">
            🔄 Refresh Page
          </button>
          <button onclick="window.open('${config.supportUrl || '/support'}', '_blank')" style="
            background: #f3f4f6;
            color: #374151;
            border: 2px solid #e5e7eb;
            padding: 14px 28px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          " onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">
            💬 Contact Support
          </button>
        </div>
        <details style="margin-top: 32px; text-align: left;">
          <summary style="
            cursor: pointer;
            color: #9ca3af;
            font-size: 14px;
            user-select: none;
          ">
            Technical Details
          </summary>
          <div style="
            margin-top: 16px;
            padding: 16px;
            background: #f9fafb;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            color: #4b5563;
            overflow-x: auto;
          ">
            <div><strong>Error Code:</strong> ${errorCode}</div>
            <div><strong>Version:</strong> ${config.version}</div>
            <div><strong>Environment:</strong> ${config.environment}</div>
            <div><strong>Message:</strong> ${error?.message || 'Unknown error'}</div>
            <div><strong>Time:</strong> ${new Date().toISOString()}</div>
          </div>
        </details>
      </div>
    `;

    // Remove existing overlay if any
    const existing = document.getElementById('app-fatal-error');
    if (existing) existing.remove();

    document.body.appendChild(overlay);
  }

  // ============================================================================
  // POST-BOOTSTRAP TASKS
  // ============================================================================

  private async performPostBootstrapTasks(): Promise<void> {
    const tasks = [
      this.recordBootstrapMetrics(),
      this.cacheBootstrapInfo(),
      this.sendBootstrapAnalytics(),
      this.performHealthCheck()
    ];

    const results = await Promise.allSettled(tasks);

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        logger.warn(`[APP BOOTSTRAP] Post-bootstrap task ${index} failed`, {
          error: result.reason
        });
      }
    });
  }

  private async recordBootstrapMetrics(): Promise<void> {
    const duration = this.status.endTime! - this.status.startTime;
    const modulesTotal = Object.keys(MODULE_CONFIGS).length;
    const modulesInitialized = Object.values(this.status.modules).filter(m => m.initialized).length;
    const errorsCount = Object.keys(this.status.errors).length;
    const warningsCount = this.status.warnings.length;

    // Record all metrics using recordTiming (available in your metrics API)
    metrics.recordTiming('app.bootstrap.duration', duration);
    metrics.recordTiming('app.bootstrap.modules.total', modulesTotal);
    metrics.recordTiming('app.bootstrap.modules.initialized', modulesInitialized);
    metrics.recordTiming('app.bootstrap.errors.count', errorsCount);
    metrics.recordTiming('app.bootstrap.warnings.count', warningsCount);
    
    // Also increment counters for better tracking
    metrics.incrementCounter('app.bootstrap.complete', 1, {
      healthy: this.status.healthy ? 'true' : 'false',
      environment: config.environment
    });
  }

  private async cacheBootstrapInfo(): Promise<void> {
    try {
      const cacheKey = `bootstrap:last:${config.instanceId}`;
      const cacheValue = JSON.stringify({
        timestamp: Date.now(),
        bootId: this.status.bootId,
        status: this.getStatus(),
        version: config.version,
        environment: config.environment
      });
      
      // Use cache.set with proper options format
      await cache.set(cacheKey, cacheValue, {
        ttl: 24 * 60 * 60 // 24 hours in seconds
      });
    } catch (error) {
      logger.warn('[APP BOOTSTRAP] Failed to cache bootstrap info', { error });
    }
  }

  private async sendBootstrapAnalytics(): Promise<void> {
    if (!this.status.modules.analytics?.initialized) return;

    try {
      // Dynamically import analytics only if module is initialized
      const analyticsModule = await import('../../lib/analytics').catch(() => null);
      
      if (analyticsModule?.analytics) {
        await analyticsModule.analytics.track('app_bootstrapped', {
          bootId: this.status.bootId,
          duration: this.status.endTime! - this.status.startTime,
          healthy: this.status.healthy,
          modules: Object.fromEntries(
            Object.entries(this.status.modules).map(([name, status]) => [
              name,
              status.initialized
            ])
          ),
          version: config.version,
          environment: config.environment,
          errorCount: Object.keys(this.status.errors).length,
          warningCount: this.status.warnings.length
        });
      }
    } catch (error) {
      logger.warn('[APP BOOTSTRAP] Failed to send analytics', { error });
    }
  }

  private async performHealthCheck(): Promise<void> {
    try {
      const health = this.getHealthCheck();
      const healthValue = health.status === 'healthy' ? 1 : (health.status === 'degraded' ? 0.5 : 0);
      
      metrics.recordTiming('app.health.status', healthValue);
      metrics.incrementCounter('app.health.check', 1, {
        status: health.status,
        environment: config.environment
      });
      
      logger.info('[APP BOOTSTRAP] Health check completed', {
        component: 'App',
        health
      });
    } catch (error) {
      logger.warn('[APP BOOTSTRAP] Health check failed', { error });
    }
  }

  private async reportBootstrapFailure(error: any): Promise<void> {
    try {
      // Send to error tracking service (Sentry, etc.)
      if (config.errorTracking?.enabled) {
        try {
          const errorTrackingModule = await import('../../utils/error-tracking/error-tracking.util').catch(() => null);
          
          if (errorTrackingModule?.errorTracker) {
            await errorTrackingModule.errorTracker.captureException(error, {
              tags: {
                phase: 'bootstrap',
                bootId: this.status.bootId
              },
              extra: {
                status: this.getStatus(),
                modules: this.getModuleSummary()
              }
            });
          }
        } catch (importError) {
          logger.debug('[APP BOOTSTRAP] Error tracking module not available', { importError });
        }
      }
    } catch (reportError) {
      // Ignore reporting errors
      logger.debug('[APP BOOTSTRAP] Error reporting failed', { reportError });
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const bootstrapApp = async (options?: BootstrapOptions): Promise<void> => {
  const bootstrapper = AppBootstrapper.getInstance();
  await bootstrapper.bootstrap(options);
};

export const getBootstrapStatus = (): Readonly<AppBootStatus> => {
  const bootstrapper = AppBootstrapper.getInstance();
  return bootstrapper.getStatus();
};

export const isAppReady = (): boolean => {
  const bootstrapper = AppBootstrapper.getInstance();
  return bootstrapper.isReady();
};

export const getAppHealth = () => {
  const bootstrapper = AppBootstrapper.getInstance();
  return bootstrapper.getHealthCheck();
};

// Singleton instance export
export const appBootstrapper = AppBootstrapper.getInstance();

// Type exports
export type {
  AppBootStatus,
  ModuleStatus,
  ModuleName,
  ModulePriority,
  BootstrapOptions
};