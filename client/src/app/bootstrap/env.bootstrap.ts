import { envConfig } from "../config/env.config";
import { logger } from "../../utils/logger/logger.util";
import { metrics } from "../../lib/monitoring";

interface EnvValidationResult {
  valid: boolean;
  missing: string[];
  invalid: Array<{ key: string; value: any; reason: string }>;
  warnings: string[];
}

class EnvBootstrapper {
  private static instance: EnvBootstrapper;
  private validated = false;
  private validationResult?: EnvValidationResult;

  private constructor() {}

  static getInstance(): EnvBootstrapper {
    if (!EnvBootstrapper.instance) {
      EnvBootstrapper.instance = new EnvBootstrapper();
    }
    return EnvBootstrapper.instance;
  }

  bootstrap(): void {
    const startTime = Date.now();

    try {
      logger.info("[ENV BOOTSTRAP] Starting environment validation", {
        component: 'Env',
        environment: process.env.NODE_ENV
      });

      // 1️⃣ Validate all environment variables
      const result = this.validateAll();

      // 2️⃣ Check for sensitive data exposure
      this.checkSensitiveData();

      // 3️⃣ Set runtime environment
      this.setRuntimeEnv();

      // 4️⃣ Freeze config to prevent modifications
      this.freezeConfig();

      this.validated = true;
      this.validationResult = result;

      const duration = Date.now() - startTime;

      metrics.recordTiming('env.bootstrap.duration', duration);
      metrics.incrementCounter('env.bootstrap.success');

      logger.info("[ENV BOOTSTRAP] Environment validation passed", {
        component: 'Env',
        duration,
        warnings: result.warnings.length
      });

      if (result.warnings.length > 0) {
        result.warnings.forEach(warning => {
          logger.warn(`[ENV BOOTSTRAP] ${warning}`, {
            component: 'Env'
          });
        });
      }

    } catch (error) {
      metrics.incrementCounter('env.bootstrap.failure');
      
      logger.error("[ENV BOOTSTRAP] Environment validation failed", {
        component: 'Env',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });

      throw error; // Hard fail - can't proceed without valid env
    }
  }

  private validateAll(): EnvValidationResult {
    const result: EnvValidationResult = {
      valid: true,
      missing: [],
      invalid: [],
      warnings: []
    };

    // Required variables (app will crash if missing)
    const requiredVars = envConfig.getRequiredVars();
    requiredVars.forEach(key => {
      const value = envConfig.get(key);
      if (value === undefined || value === null || value === '') {
        result.missing.push(key);
        result.valid = false;
      }
    });

    // Optional but recommended
    const recommendedVars = envConfig.getRecommendedVars();
    recommendedVars.forEach(key => {
      const value = envConfig.get(key);
      if (value === undefined || value === null || value === '') {
        result.warnings.push(`Recommended env var missing: ${key}`);
      }
    });

    // Validate formats
    const validations = envConfig.getValidations();
    Object.entries(validations).forEach(([key, validator]) => {
      const value = envConfig.get(key);
      if (value !== undefined) {
        try {
          validator(value);
        } catch (error) {
          result.invalid.push({
            key,
            value,
            reason: error instanceof Error ? error.message : 'Invalid format'
          });
          result.valid = false;
        }
      }
    });

    // Check for environment-specific overrides
    this.checkEnvironmentOverrides(result);

    if (!result.valid) {
      const error = new Error(
        `Environment validation failed:\n` +
        `Missing: ${result.missing.join(', ')}\n` +
        `Invalid: ${result.invalid.map(i => i.key).join(', ')}`
      );
      error.name = 'EnvValidationError';
      throw error;
    }

    return result;
  }

  private checkEnvironmentOverrides(result: EnvValidationResult): void {
    const environment = process.env.NODE_ENV || 'development';
    const overrides = envConfig.getEnvironmentOverrides();

    if (overrides[environment]) {
      Object.entries(overrides[environment]).forEach(([key, expectedValue]) => {
        const actualValue = envConfig.get(key);
        if (actualValue !== expectedValue) {
          result.warnings.push(
            `${key} should be '${expectedValue}' in ${environment} environment (current: ${actualValue})`
          );
        }
      });
    }
  }

  private checkSensitiveData(): void {
    const sensitiveKeys = ['KEY', 'SECRET', 'PASSWORD', 'TOKEN', 'CREDENTIAL'];
    const allEnv = { ...process.env };

    Object.entries(allEnv).forEach(([key, value]) => {
      if (sensitiveKeys.some(sk => key.includes(sk))) {
        if (value && value.length < 8) {
          logger.warn(`[ENV BOOTSTRAP] ${key} seems too short for sensitive data`, {
            component: 'Env',
            key,
            length: value.length
          });
        }

        // Check if value looks like a placeholder
        if (value && (value.includes('your-') || value.includes('xxxx'))) {
          logger.warn(`[ENV BOOTSTRAP] ${key} appears to be a placeholder`, {
            component: 'Env',
            key
          });
        }
      }
    });
  }

  private setRuntimeEnv(): void {
    // Set global runtime flags
    if (typeof window !== 'undefined') {
      window.__RUNTIME_ENV__ = {
        NODE_ENV: process.env.NODE_ENV,
        APP_VERSION: envConfig.get('APP_VERSION'),
        BUILD_TIME: new Date().toISOString(),
        FEATURES: envConfig.get('ENABLED_FEATURES')?.split(',') || []
      };
    }

    // Set performance marks
    if (typeof performance !== 'undefined') {
      performance.mark('env-bootstrap-complete');
    }
  }

  private freezeConfig(): void {
    // Deep freeze the config to prevent runtime modifications
    const config = envConfig.getAll();
    this.deepFreeze(config);
  }

  private deepFreeze(obj: any): void {
    Object.freeze(obj);
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object' && !Object.isFrozen(obj[key])) {
        this.deepFreeze(obj[key]);
      }
    });
  }

  isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  isTest(): boolean {
    return process.env.NODE_ENV === 'test';
  }

  getValidationReport(): EnvValidationResult | undefined {
    return this.validationResult;
  }
}

export const bootstrapEnv = (): void => {
  const bootstrapper = EnvBootstrapper.getInstance();
  bootstrapper.bootstrap();
};

// Export helpers
export const isDevelopment = (): boolean => EnvBootstrapper.getInstance().isDevelopment();
export const isProduction = (): boolean => EnvBootstrapper.getInstance().isProduction();
export const isTest = (): boolean => EnvBootstrapper.getInstance().isTest();