import { bootstrapEnv } from "./env.bootstrap";
import { bootstrapApp } from "./app.bootstrap";
import { bootstrapFeatureFlags } from "./feature-flags.bootstrap";
import { bootstrapAnalytics } from "./analytics.bootstrap";
import { bootstrapAI } from "./ai.bootstrap";
import { bootstrapSecurity } from "./security.bootstrap";
import { bootstrapPerformance } from "./performance.bootstrap";
import { bootstrapMonitoring } from "./monitoring.bootstrap";
import { logger } from "../../utils/logger/logger.util";
import { metrics } from "../../lib/monitoring";

interface BootstrapOptions {
  skipAnalytics?: boolean;
  skipAI?: boolean;
  skipPerformance?: boolean;
  timeout?: number;
  onProgress?: (phase: string, status: 'start' | 'complete' | 'error') => void;
}

class ApplicationBootstrapper {
  private static instance: ApplicationBootstrapper;
  private bootstrapPromise: Promise<void> | null = null;
  private bootstrapped = false;

  private constructor() {}

  static getInstance(): ApplicationBootstrapper {
    if (!ApplicationBootstrapper.instance) {
      ApplicationBootstrapper.instance = new ApplicationBootstrapper();
    }
    return ApplicationBootstrapper.instance;
  }

  async bootstrap(options: BootstrapOptions = {}): Promise<void> {
    // Prevent multiple bootstraps
    if (this.bootstrapped) {
      logger.info("[BOOTSTRAP] Application already bootstrapped", {
        component: 'Bootstrap'
      });
      return;
    }

    // Return existing promise if bootstrap in progress
    if (this.bootstrapPromise) {
      return this.bootstrapPromise;
    }

    this.bootstrapPromise = this.runBootstrap(options);
    
    try {
      await this.bootstrapPromise;
      this.bootstrapped = true;
    } finally {
      this.bootstrapPromise = null;
    }
  }

  private async runBootstrap(options: BootstrapOptions): Promise<void> {
    const startTime = Date.now();
    const { onProgress } = options;

    logger.info("[BOOTSTRAP] 🚀 Starting application bootstrap", {
      component: 'Bootstrap',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });

    metrics.incrementCounter('bootstrap.start');

    try {
      // Phase 1: Critical (must succeed)
      onProgress?.('env', 'start');
      logger.info("[BOOTSTRAP] Phase 1/7: Validating environment");
      bootstrapEnv();
      onProgress?.('env', 'complete');
      metrics.incrementCounter('bootstrap.phase.env');

      onProgress?.('security', 'start');
      logger.info("[BOOTSTRAP] Phase 2/7: Initializing security");
      await bootstrapSecurity();
      onProgress?.('security', 'complete');
      metrics.incrementCounter('bootstrap.phase.security');

      onProgress?.('monitoring', 'start');
      logger.info("[BOOTSTRAP] Phase 3/7: Setting up monitoring");
      await bootstrapMonitoring();
      onProgress?.('monitoring', 'complete');
      metrics.incrementCounter('bootstrap.phase.monitoring');

      // Phase 2: Core features
      onProgress?.('features', 'start');
      logger.info("[BOOTSTRAP] Phase 4/7: Loading feature flags");
      await bootstrapFeatureFlags();
      onProgress?.('features', 'complete');
      metrics.incrementCounter('bootstrap.phase.features');

      // Phase 3: Performance (optional)
      if (!options.skipPerformance) {
        onProgress?.('performance', 'start');
        logger.info("[BOOTSTRAP] Phase 5/7: Optimizing performance");
        await bootstrapPerformance().catch(error => {
          logger.warn("[BOOTSTRAP] Performance optimization failed", {
            component: 'Bootstrap',
            error: error.message
          });
        });
        onProgress?.('performance', 'complete');
      }

      // Phase 4: Analytics (optional)
      if (!options.skipAnalytics) {
        onProgress?.('analytics', 'start');
        logger.info("[BOOTSTRAP] Phase 6/7: Initializing analytics");
        await bootstrapAnalytics().catch(error => {
          logger.warn("[BOOTSTRAP] Analytics initialization failed", {
            component: 'Bootstrap',
            error: error.message
          });
        });
        onProgress?.('analytics', 'complete');
      }

      // Phase 5: AI (optional)
      if (!options.skipAI) {
        onProgress?.('ai', 'start');
        logger.info("[BOOTSTRAP] Phase 7/7: Starting AI services");
        await bootstrapAI().catch(error => {
          logger.warn("[BOOTSTRAP] AI initialization failed", {
            component: 'Bootstrap',
            error: error.message
          });
        });
        onProgress?.('ai', 'complete');
      }

      // Finalize
      await bootstrapApp();

      const duration = Date.now() - startTime;
      
      logger.info("[BOOTSTRAP] ✅ Application bootstrap complete", {
        component: 'Bootstrap',
        duration,
        memory: process.memoryUsage?.()
      });

      metrics.recordTiming('bootstrap.total', duration);
      metrics.incrementCounter('bootstrap.success');

      // Mark performance
      if (typeof performance !== 'undefined') {
        performance.mark('bootstrap-complete');
        performance.measure('bootstrap-total', 'bootstrap-start', 'bootstrap-complete');
      }

    } catch (error) {
      const duration = Date.now() - startTime;
      
      logger.error("[BOOTSTRAP] ❌ Bootstrap failed", {
        component: 'Bootstrap',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        duration
      });

      metrics.incrementCounter('bootstrap.failure');
      metrics.recordTiming('bootstrap.failure.time', duration);

      throw error;
    }
  }

  isBootstrapped(): boolean {
    return this.bootstrapped;
  }

  async waitForBootstrap(): Promise<void> {
    if (this.bootstrapped) return;
    if (this.bootstrapPromise) {
      await this.bootstrapPromise;
    }
  }
}

export const bootstrapApplication = async (options?: BootstrapOptions): Promise<void> => {
  const bootstrapper = ApplicationBootstrapper.getInstance();
  await bootstrapper.bootstrap(options);
};

export const isApplicationBootstrapped = (): boolean => {
  return ApplicationBootstrapper.getInstance().isBootstrapped();
};

export const waitForApplication = async (): Promise<void> => {
  await ApplicationBootstrapper.getInstance().waitForBootstrap();
};

// Bootstrap monitoring
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    waitForApplication().then(() => {
      logger.info("[BOOTSTRAP] Application ready", {
        component: 'Bootstrap'
      });
    });
  });
}

export default bootstrapApplication;