import { featureRegistry } from "../registry/feature.registry";
import { logger } from "../../utils/logger/logger.util";
import { metrics } from "../../lib/monitoring";
import { cache } from "../../lib/cache";
import { config } from "../config/app.config";

interface FeatureFlag {
  name: string;
  enabled: boolean;
  rolloutPercentage?: number;
  dependencies?: string[];
  expiresAt?: number;
  rules?: Array<{
    condition: string;
    value: boolean;
  }>;
}

interface FeatureOverride {
  userId?: string;
  role?: string;
  hospitalId?: string;
  features: Record<string, boolean>;
}

class FeatureFlagBootstrapper {
  private static instance: FeatureFlagBootstrapper;
  private flags: Map<string, FeatureFlag> = new Map();
  private overrides: Map<string, FeatureOverride> = new Map();
  private initialized = false;
  private refreshInterval: NodeJS.Timeout | null = null;
  private readonly REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly CACHE_KEY = 'feature:flags';
  private readonly CACHE_TTL = 300; // 5 minutes

  private constructor() {}

  static getInstance(): FeatureFlagBootstrapper {
    if (!FeatureFlagBootstrapper.instance) {
      FeatureFlagBootstrapper.instance = new FeatureFlagBootstrapper();
    }
    return FeatureFlagBootstrapper.instance;
  }

  async bootstrap(): Promise<void> {
    const startTime = Date.now();

    try {
      logger.info("[FEATURE FLAGS BOOTSTRAP] Starting feature flags initialization", {
        component: 'FeatureFlags'
      });

      // 1️⃣ Load flags from backend
      await this.loadFlags();

      // 2️⃣ Load user overrides
      await this.loadOverrides();

      // 3️⃣ Setup refresh interval
      this.setupRefreshInterval();

      // 4️⃣ Validate dependencies
      this.validateDependencies();

      // 5️⃣ Freeze registry
      featureRegistry.freeze();

      this.initialized = true;

      const duration = Date.now() - startTime;

      metrics.recordTiming('feature-flags.bootstrap.duration', duration);
      metrics.incrementCounter('feature-flags.bootstrap.success');

      logger.info("[FEATURE FLAGS BOOTSTRAP] Feature flags initialized", {
        component: 'FeatureFlags',
        duration,
        flagCount: this.flags.size,
        overridesCount: this.overrides.size
      });

    } catch (error) {
      metrics.incrementCounter('feature-flags.bootstrap.failure');
      
      logger.error("[FEATURE FLAGS BOOTSTRAP] Feature flags initialization failed", {
        component: 'FeatureFlags',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });

      // Use default flags if available
      await this.loadDefaultFlags();
    }
  }

  private async loadFlags(): Promise<void> {
    try {
      // Try cache first
      const cached = await cache.get<FeatureFlag[]>(this.CACHE_KEY);
      
      if (cached) {
        cached.forEach(flag => this.flags.set(flag.name, flag));
        logger.info("[FEATURE FLAGS] Loaded from cache", {
          component: 'FeatureFlags',
          count: cached.length
        });
        return;
      }

      // Fetch from backend
      const response = await fetch('/api/features/flags', {
        headers: {
          'Cache-Control': 'no-cache',
          'X-App-Version': config.version
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch feature flags: ${response.status}`);
      }

      const flags: FeatureFlag[] = await response.json();
      
      flags.forEach(flag => this.flags.set(flag.name, flag));

      // Store in cache
      await cache.set(this.CACHE_KEY, flags, {
        expiresIn: this.CACHE_TTL
      });

      logger.info("[FEATURE FLAGS] Loaded from backend", {
        component: 'FeatureFlags',
        count: flags.length
      });

    } catch (error) {
      logger.error("[FEATURE FLAGS] Failed to load flags", {
        component: 'FeatureFlags',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private async loadOverrides(): Promise<void> {
    try {
      // Load user-specific overrides if user is logged in
      const userId = this.getCurrentUserId();
      if (userId) {
        const response = await fetch(`/api/features/overrides/${userId}`);
        if (response.ok) {
          const override: FeatureOverride = await response.json();
          this.overrides.set(userId, override);
        }
      }

      // Load role-based overrides
      const role = this.getCurrentUserRole();
      if (role) {
        const response = await fetch(`/api/features/overrides/role/${role}`);
        if (response.ok) {
          const override: FeatureOverride = await response.json();
          this.overrides.set(`role:${role}`, override);
        }
      }

    } catch (error) {
      logger.warn("[FEATURE FLAGS] Failed to load overrides", {
        component: 'FeatureFlags',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async loadDefaultFlags(): Promise<void> {
    // Load from environment or hardcoded defaults
    const defaultFlags = config.featureFlags || {
      'ai-symptom-checker': true,
      'video-consult': false,
      'chat-support': true
    };

    Object.entries(defaultFlags).forEach(([name, enabled]) => {
      this.flags.set(name, {
        name,
        enabled: enabled as boolean
      });
    });

    logger.info("[FEATURE FLAGS] Using default flags", {
      component: 'FeatureFlags',
      count: this.flags.size
    });
  }

  private setupRefreshInterval(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    this.refreshInterval = setInterval(() => {
      this.loadFlags().catch(error => {
        logger.error("[FEATURE FLAGS] Refresh failed", {
          component: 'FeatureFlags',
          error: error.message
        });
      });
    }, this.REFRESH_INTERVAL);

    // Don't prevent Node.js from exiting
    if (this.refreshInterval.unref) {
      this.refreshInterval.unref();
    }
  }

  private validateDependencies(): void {
    this.flags.forEach((flag, name) => {
      if (flag.dependencies) {
        flag.dependencies.forEach(dep => {
          if (!this.flags.has(dep)) {
            logger.warn(`[FEATURE FLAGS] Flag ${name} depends on missing flag: ${dep}`, {
              component: 'FeatureFlags'
            });
          }
        });
      }
    });
  }

  isEnabled(featureName: string): boolean {
    if (!this.initialized) {
      logger.warn(`[FEATURE FLAGS] Checking flag before initialization: ${featureName}`, {
        component: 'FeatureFlags'
      });
      return false;
    }

    // Check user overrides first
    const userId = this.getCurrentUserId();
    if (userId) {
      const userOverride = this.overrides.get(userId);
      if (userOverride?.features[featureName] !== undefined) {
        return userOverride.features[featureName];
      }
    }

    // Check role overrides
    const role = this.getCurrentUserRole();
    if (role) {
      const roleOverride = this.overrides.get(`role:${role}`);
      if (roleOverride?.features[featureName] !== undefined) {
        return roleOverride.features[featureName];
      }
    }

    // Get base flag
    const flag = this.flags.get(featureName);
    if (!flag) {
      logger.debug(`[FEATURE FLAGS] Unknown feature: ${featureName}`, {
        component: 'FeatureFlags'
      });
      return false;
    }

    // Check if expired
    if (flag.expiresAt && Date.now() > flag.expiresAt) {
      return false;
    }

    // Check rollout percentage
    if (flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100) {
      return this.checkRollout(featureName, flag.rolloutPercentage);
    }

    // Check custom rules
    if (flag.rules && flag.rules.length > 0) {
      return this.evaluateRules(flag.rules);
    }

    return flag.enabled;
  }

  private checkRollout(featureName: string, percentage: number): boolean {
    const userId = this.getCurrentUserId();
    if (!userId) return percentage >= 100;

    // Deterministic hash for consistent rollout
    const hash = this.hashString(`${featureName}:${userId}`);
    return (hash % 100) < percentage;
  }

  private evaluateRules(rules: FeatureFlag['rules']): boolean {
    if (!rules) return false;

    // Simple rule evaluation - can be extended
    return rules.every(rule => {
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function('context', `return ${rule.condition}`);
        return fn(this.getEvaluationContext()) === rule.value;
      } catch {
        return false;
      }
    });
  }

  private getEvaluationContext(): Record<string, any> {
    return {
      userId: this.getCurrentUserId(),
      role: this.getCurrentUserRole(),
      hospitalId: this.getCurrentHospitalId(),
      timestamp: Date.now(),
      environment: process.env.NODE_ENV
    };
  }

  private getCurrentUserId(): string | undefined {
    // Get from auth context
    return typeof window !== 'undefined' 
      ? window.__USER__?.id 
      : undefined;
  }

  private getCurrentUserRole(): string | undefined {
    return typeof window !== 'undefined'
      ? window.__USER__?.role
      : undefined;
  }

  private getCurrentHospitalId(): string | undefined {
    return typeof window !== 'undefined'
      ? window.__USER__?.hospitalId
      : undefined;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  getAllFlags(): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    this.flags.forEach((_, name) => {
      result[name] = this.isEnabled(name);
    });
    return result;
  }

  destroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}

export const bootstrapFeatureFlags = async (): Promise<void> => {
  const bootstrapper = FeatureFlagBootstrapper.getInstance();
  await bootstrapper.bootstrap();
};

// Export hook for components
export const useFeatureFlag = (featureName: string): boolean => {
  // This would be implemented with React hooks
  return FeatureFlagBootstrapper.getInstance().isEnabled(featureName);
};