// src/app/bootstrap/ai.bootstrap.ts

import { aiConfig } from "../config/ai.config";
import { logger as appLogger } from "../../utils/logger/logger.util";

// ✅ Type-safe AI Config interface
interface AIConfig {
  enabled: boolean;
  apiKey: string;
  model: string;
  timeout: number;
  preloadModels?: boolean;
  disabledReason?: string;
  healthEndpoint?: string;
  required?: boolean;
}

interface AIBootStatus {
  initialized: boolean;
  modelLoaded: boolean;
  error?: Error;
  timestamp: number;
}

// ✅ Environment detection
const isDevelopment = (): boolean => {
  try {
    // @ts-ignore - Check for development mode
    return import.meta.env?.MODE === 'development' || 
           // @ts-ignore
           (window as any).__ENV__?.NODE_ENV === 'development';
  } catch {
    return false;
  }
};

const isProduction = (): boolean => {
  try {
    // @ts-ignore - Check for production mode
    return import.meta.env?.MODE === 'production' || 
           // @ts-ignore
           (window as any).__ENV__?.NODE_ENV === 'production';
  } catch {
    return false;
  }
};

// ✅ Logger with fallback - NO process.env
const logger = appLogger || {
  info: (message: string, meta?: Record<string, any>) => {
    if (!isProduction()) {
      console.log(`[INFO] ${message}`, meta || '');
    }
  },
  warn: (message: string, meta?: Record<string, any>) => {
    if (!isProduction()) {
      console.warn(`[WARN] ${message}`, meta || '');
    }
  },
  error: (message: string, meta?: Record<string, any>) => {
    console.error(`[ERROR] ${message}`, meta || '');
  }
};

// ✅ Simple metrics implementation - NO process.env
const metrics = {
  recordTiming: (metric: string, duration: number) => {
    if (isDevelopment()) {
      console.log(`[METRICS] ${metric}: ${duration}ms`);
    }
  },
  incrementCounter: (metric: string) => {
    if (isDevelopment()) {
      console.log(`[METRICS] ${metric} +1`);
    }
  }
};

class AIBootstrapper {
  private static instance: AIBootstrapper;
  private bootStatus: AIBootStatus = {
    initialized: false,
    modelLoaded: false,
    timestamp: Date.now()
  };
  private retryCount = 0;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;

  private constructor() {}

  static getInstance(): AIBootstrapper {
    if (!AIBootstrapper.instance) {
      AIBootstrapper.instance = new AIBootstrapper();
    }
    return AIBootstrapper.instance;
  }

  async bootstrap(): Promise<void> {
    const startTime = Date.now();
    
    try {
      logger.info("[AI BOOTSTRAP] Starting AI system initialization");

      const config = this.getConfig();
      
      if (!config.enabled) {
        logger.info("[AI BOOTSTRAP] AI system is disabled", {
          reason: config.disabledReason || 'config_disabled'
        });
        return;
      }

      await this.validateConfig(config);
      await this.initializeWithRetry();

      if (config.preloadModels) {
        await this.loadModels();
      }

      this.setupHealthChecks();

      const duration = Date.now() - startTime;
      metrics.recordTiming('ai.bootstrap.duration', duration);
      metrics.incrementCounter('ai.bootstrap.success');

      this.bootStatus.initialized = true;
      this.bootStatus.timestamp = Date.now();

      logger.info("[AI BOOTSTRAP] AI system initialized successfully", {
        duration,
        modelLoaded: this.bootStatus.modelLoaded
      });

    } catch (error) {
      this.bootStatus.error = error as Error;
      metrics.incrementCounter('ai.bootstrap.failure');
      
      logger.error("[AI BOOTSTRAP] AI system initialization failed", {
        error: error instanceof Error ? error.message : 'Unknown error',
        retryCount: this.retryCount
      });

      const config = this.getConfig();
      if (config.required) {
        throw error;
      }
    }
  }

  private getConfig(): AIConfig {
    try {
      if (aiConfig && typeof aiConfig === 'object' && 'get' in aiConfig) {
        return (aiConfig as any).get();
      }
      return aiConfig as unknown as AIConfig;
    } catch (error) {
      logger.error("[AI BOOTSTRAP] Failed to get config", {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new Error('AI configuration not available');
    }
  }

  private async validateConfig(config: AIConfig): Promise<void> {
    const requiredFields: (keyof AIConfig)[] = ['apiKey', 'model', 'timeout'];
    const missingFields = requiredFields.filter(field => {
      const value = config[field];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      throw new Error(`AI config missing required fields: ${missingFields.join(', ')}`);
    }

    if (config.apiKey && 
        !config.apiKey.startsWith('sk-') && 
        !config.apiKey.startsWith('pk-')) {
      logger.warn("[AI BOOTSTRAP] API key format looks invalid", {
        keyPrefix: config.apiKey.substring(0, 3)
      });
    }

    if (config.timeout < 1000 || config.timeout > 30000) {
      logger.warn("[AI BOOTSTRAP] Timeout out of range, using default 10s", {
        providedTimeout: config.timeout
      });
    }
  }

  private async initializeWithRetry(): Promise<void> {
    while (this.retryCount < this.MAX_RETRIES) {
      try {
        if (aiConfig && typeof aiConfig === 'object' && 'initialize' in aiConfig) {
          await (aiConfig as any).initialize();
        }
        
        await this.pingAIService();
        
        return;
      } catch (error) {
        this.retryCount++;
        
        if (this.retryCount >= this.MAX_RETRIES) {
          throw error;
        }
        
        logger.warn("[AI BOOTSTRAP] Initialization failed, retrying", {
          retryCount: this.retryCount,
          maxRetries: this.MAX_RETRIES
        });
        
        await this.delay(this.RETRY_DELAY * Math.pow(2, this.retryCount - 1));
      }
    }
  }

  private async pingAIService(): Promise<void> {
    const config = this.getConfig();
    
    if (isDevelopment()) {
      logger.warn("[AI BOOTSTRAP] Skipping health check in development");
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const healthEndpoint = config.healthEndpoint || '/api/ai/health';
      
      if (typeof fetch === 'undefined') {
        logger.warn("[AI BOOTSTRAP] Fetch API not available, skipping health check");
        return;
      }

      const response = await fetch(healthEndpoint, {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`AI service health check failed: ${response.status}`);
      }

      logger.info("[AI BOOTSTRAP] Health check passed", {
        endpoint: healthEndpoint
      });

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('AI service health check timed out');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async loadModels(): Promise<void> {
    try {
      logger.info("[AI BOOTSTRAP] Preloading AI models");

      setTimeout(async () => {
        try {
          if (aiConfig && typeof aiConfig === 'object' && 'loadModels' in aiConfig) {
            await (aiConfig as any).loadModels();
            this.bootStatus.modelLoaded = true;
            
            logger.info("[AI BOOTSTRAP] Models preloaded successfully");
          } else {
            logger.warn("[AI BOOTSTRAP] loadModels method not available");
          }
        } catch (error) {
          logger.error("[AI BOOTSTRAP] Model preloading failed", {
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }, 0);

    } catch (error) {
      logger.error("[AI BOOTSTRAP] Model loading error", {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private setupHealthChecks(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      logger.info("[AI BOOTSTRAP] Connection restored, checking AI service");
      this.pingAIService().catch((error) => {
        logger.warn("[AI BOOTSTRAP] AI service unreachable after reconnect", {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      });
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStatus(): AIBootStatus {
    return { ...this.bootStatus };
  }

  isHealthy(): boolean {
    return this.bootStatus.initialized && !this.bootStatus.error;
  }

  reset(): void {
    this.bootStatus = {
      initialized: false,
      modelLoaded: false,
      timestamp: Date.now()
    };
    this.retryCount = 0;
  }
}

// ✅ Export singleton instance and bootstrap function
export const aiBootstrapper = AIBootstrapper.getInstance();

export const bootstrapAI = async (): Promise<void> => {
  await aiBootstrapper.bootstrap();
};

// ✅ Export for testing - Fixed! No 'process' error
export { AIBootstrapper };