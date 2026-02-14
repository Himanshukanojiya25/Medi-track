// src/app/bootstrap/analytics.bootstrap.ts

import { analyticsConfig } from "../config/analytics.config";
import { logger } from "../../utils";
import { metrics } from "../../lib/monitoring";        // ✅ metrics.service.ts se
import { cache } from "../../lib/cache";              // ✅ cache.service.ts se

/**
 * 🎯 Production-Grade Analytics Bootstrap
 * ✅ Multiple provider support (GA4, Mixpanel, PostHog)
 * ✅ Event queueing & retry logic
 * ✅ GDPR consent management
 * ✅ Type-safe
 * ✅ Browser-only (safe checks)
 */

// ================ TYPES ================

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
}

interface AnalyticsConfig {
  enabled: boolean;
  providers: ('google' | 'mixpanel' | 'posthog')[];
  googleTrackingId?: string;
  mixpanelToken?: string;
  posthogKey?: string;
  posthogHost?: string;
  debug?: boolean;
}

// ================ WINDOW AUGMENTATION ================

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    mixpanel?: any;
    posthog?: any;
  }
}

// ================ ENVIRONMENT CHECK ================

const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};

// ================ MAIN CLASS ================

class AnalyticsBootstrapper {
  private static instance: AnalyticsBootstrapper;
  private initialized = false;
  private eventQueue: AnalyticsEvent[] = [];
  private flushTimerId: number | null = null;
  private readonly FLUSH_INTERVAL = 5000; // 5 seconds
  private readonly MAX_QUEUE_SIZE = 100;
  private readonly MAX_RETRIES = 3;
  private userId?: string;
  private sessionId: string;
  private mutationObserver: MutationObserver | null = null;

  private constructor() {
    this.sessionId = this.generateSessionId();
    
    // Only setup listeners in browser
    if (isBrowser()) {
      this.setupEventListeners();
    }
  }

  static getInstance(): AnalyticsBootstrapper {
    if (!AnalyticsBootstrapper.instance) {
      AnalyticsBootstrapper.instance = new AnalyticsBootstrapper();
    }
    return AnalyticsBootstrapper.instance;
  }

  async bootstrap(): Promise<void> {
    // Skip if not in browser
    if (!isBrowser()) {
      logger.info("[ANALYTICS BOOTSTRAP] Skipping - not in browser environment");
      return;
    }

    const startTime = Date.now();

    try {
      logger.info("[ANALYTICS BOOTSTRAP] Starting analytics initialization", {
        component: 'Analytics'
      });

      // 1️⃣ Check if analytics is enabled
      const config = this.getConfig();
      if (!config.enabled) {
        logger.info("[ANALYTICS BOOTSTRAP] Analytics disabled", {
          component: 'Analytics'
        });
        return;
      }

      // 2️⃣ Validate configuration
      this.validateConfig(config);

      // 3️⃣ Initialize providers
      await this.initializeProviders(config);

      // 4️⃣ Setup flush interval
      this.setupFlushInterval();

      // 5️⃣ Load user consent
      await this.loadUserConsent();

      this.initialized = true;

      // 6️⃣ Process any queued events
      await this.processQueue();

      const duration = Date.now() - startTime;
      metrics.recordTiming('analytics.bootstrap.duration', duration);
      metrics.incrementCounter('analytics.bootstrap.success');

      logger.info("[ANALYTICS BOOTSTRAP] Analytics initialized successfully", {
        component: 'Analytics',
        duration,
        queueSize: this.eventQueue.length
      });

    } catch (error) {
      metrics.incrementCounter('analytics.bootstrap.failure');
      
      logger.error("[ANALYTICS BOOTSTRAP] Analytics initialization failed", {
        component: 'Analytics',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });

      // Don't throw - analytics is optional
    }
  }

  // ================ CONFIGURATION ================

  private getConfig(): AnalyticsConfig {
    try {
      // Type-safe config access
      if (typeof analyticsConfig === 'object' && 'get' in analyticsConfig) {
        return (analyticsConfig as any).get();
      }
      
      // Fallback config
      return {
        enabled: false,
        providers: []
      };
    } catch (error) {
      logger.error("[ANALYTICS] Failed to get config", {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      return {
        enabled: false,
        providers: []
      };
    }
  }

  private validateConfig(config: AnalyticsConfig): void {
    if (!config.providers || config.providers.length === 0) {
      logger.warn("[ANALYTICS BOOTSTRAP] No analytics providers configured", {
        component: 'Analytics'
      });
      return;
    }

    // Validate each provider's config
    config.providers.forEach(provider => {
      switch (provider) {
        case 'google':
          if (!config.googleTrackingId) {
            throw new Error('Google Analytics requires tracking ID');
          }
          break;
        case 'mixpanel':
          if (!config.mixpanelToken) {
            throw new Error('Mixpanel requires token');
          }
          break;
        case 'posthog':
          if (!config.posthogKey) {
            throw new Error('PostHog requires API key');
          }
          break;
      }
    });
  }

  // ================ PROVIDER INITIALIZATION ================

  private async initializeProviders(config: AnalyticsConfig): Promise<void> {
    const initPromises: Promise<void>[] = [];

    // Initialize providers in parallel
    if (config.providers.includes('google')) {
      initPromises.push(this.initGoogleAnalytics(config));
    }
    if (config.providers.includes('mixpanel')) {
      initPromises.push(this.initMixpanel(config));
    }
    if (config.providers.includes('posthog')) {
      initPromises.push(this.initPostHog(config));
    }

    const results = await Promise.allSettled(initPromises);
    
    // Log any failures
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        logger.error("[ANALYTICS] Provider initialization failed", {
          component: 'Analytics',
          provider: config.providers[index],
          error: result.reason
        });
      }
    });
  }

  private async initGoogleAnalytics(config: AnalyticsConfig): Promise<void> {
    try {
      if (!config.googleTrackingId) {
        throw new Error('Google tracking ID not configured');
      }

      // Load GA4 script
      await this.loadScript(
        `https://www.googletagmanager.com/gtag/js?id=${config.googleTrackingId}`
      );
      
      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(...args: any[]) { 
        window.dataLayer!.push(args); 
      };
      
      window.gtag('js', new Date());
      window.gtag('config', config.googleTrackingId, {
        send_page_view: false, // We'll send manually
        anonymize_ip: true
      });

      logger.info("[ANALYTICS] Google Analytics initialized", {
        component: 'Analytics',
        provider: 'google'
      });

    } catch (error) {
      throw new Error(
        `Failed to initialize Google Analytics: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  private async initMixpanel(config: AnalyticsConfig): Promise<void> {
    try {
      if (!config.mixpanelToken) {
        throw new Error('Mixpanel token not configured');
      }

      await this.loadScript('https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js');
      
      // Initialize Mixpanel
      if (typeof (window as any).mixpanel !== 'undefined') {
        (window as any).mixpanel.init(config.mixpanelToken, {
          debug: config.debug || false,
          track_pageview: false
        });
        
        window.mixpanel = (window as any).mixpanel;
      }

      logger.info("[ANALYTICS] Mixpanel initialized", {
        component: 'Analytics',
        provider: 'mixpanel'
      });

    } catch (error) {
      throw new Error(
        `Failed to initialize Mixpanel: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  private async initPostHog(config: AnalyticsConfig): Promise<void> {
    try {
      if (!config.posthogKey) {
        throw new Error('PostHog key not configured');
      }

      await this.loadScript('https://cdn.posthog.com/static/array.js');
      
      // Initialize PostHog
      if (typeof (window as any).posthog !== 'undefined') {
        (window as any).posthog.init(config.posthogKey, {
          api_host: config.posthogHost || 'https://app.posthog.com',
          loaded: (ph: any) => {
            ph.identify(this.sessionId);
          }
        });
        
        window.posthog = (window as any).posthog;
      }

      logger.info("[ANALYTICS] PostHog initialized", {
        component: 'Analytics',
        provider: 'posthog'
      });

    } catch (error) {
      throw new Error(
        `Failed to initialize PostHog: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  private loadScript(src: string): Promise<void> {
    if (!isBrowser()) {
      return Promise.reject(new Error('Not in browser environment'));
    }

    return new Promise((resolve, reject) => {
      // Check if already loaded
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      
      document.head.appendChild(script);
    });
  }

  // ================ FLUSH & INTERVALS ================

  private setupFlushInterval(): void {
    if (this.flushTimerId !== null) {
      clearInterval(this.flushTimerId);
    }

    this.flushTimerId = setInterval(() => {
      this.flush().catch(error => {
        logger.error("[ANALYTICS] Failed to flush events", {
          component: 'Analytics',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      });
    }, this.FLUSH_INTERVAL) as unknown as number;
  }

  // ================ CONSENT MANAGEMENT ================

  private async loadUserConsent(): Promise<void> {
    try {
      const consent = await cache.get<string>('user:consent:analytics');
      if (consent) {
        this.setConsent(consent === 'granted');
      }
    } catch (error) {
      logger.warn("[ANALYTICS] Failed to load user consent", {
        component: 'Analytics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  setConsent(granted: boolean): void {
    const config = this.getConfig();
    
    if (config.providers.includes('google') && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: granted ? 'granted' : 'denied'
      });
    }

    // Store consent
    cache.set('user:consent:analytics', granted ? 'granted' : 'denied', {
      ttl: 365 * 24 * 60 * 60 // 1 year
    }).catch(() => {});
  }

  // ================ EVENT TRACKING ================

  track(eventName: string, properties?: Record<string, any>): void {
    if (!isBrowser()) return;

    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        session_id: this.sessionId,
        user_id: this.userId,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    };

    if (!this.initialized) {
      // Queue events if not initialized
      if (this.eventQueue.length < this.MAX_QUEUE_SIZE) {
        this.eventQueue.push(event);
      } else {
        logger.warn("[ANALYTICS] Event queue full, dropping event", {
          component: 'Analytics',
          eventName
        });
      }
      return;
    }

    this.sendEvent(event).catch(error => {
      logger.error("[ANALYTICS] Failed to send event", {
        component: 'Analytics',
        eventName,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    });
  }

  private async sendEvent(event: AnalyticsEvent, retryCount = 0): Promise<void> {
    const config = this.getConfig();

    try {
      const sendPromises: Promise<void>[] = [];

      if (config.providers.includes('google')) {
        sendPromises.push(
          this.sendToGoogleAnalytics(event).catch(() => {})
        );
      }
      if (config.providers.includes('mixpanel')) {
        sendPromises.push(
          this.sendToMixpanel(event).catch(() => {})
        );
      }
      if (config.providers.includes('posthog')) {
        sendPromises.push(
          this.sendToPostHog(event).catch(() => {})
        );
      }

      await Promise.all(sendPromises);

      metrics.incrementCounter('analytics.events.sent');
      
    } catch (error) {
      metrics.incrementCounter('analytics.events.failed');

      if (retryCount < this.MAX_RETRIES) {
        // Retry with exponential backoff
        setTimeout(() => {
          this.sendEvent(event, retryCount + 1);
        }, Math.pow(2, retryCount) * 1000);
      }
    }
  }

  private async sendToGoogleAnalytics(event: AnalyticsEvent): Promise<void> {
    return new Promise((resolve) => {
      if (!window.gtag) {
        resolve();
        return;
      }

      window.gtag('event', event.name, {
        ...event.properties,
        event_callback: () => resolve(),
        event_timeout: 500
      });

      // Fallback if callback doesn't fire
      setTimeout(resolve, 500);
    });
  }

  private async sendToMixpanel(event: AnalyticsEvent): Promise<void> {
    if (!window.mixpanel) return;
    
    try {
      window.mixpanel.track(event.name, event.properties);
    } catch (error) {
      logger.error("[ANALYTICS] Mixpanel tracking error", {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async sendToPostHog(event: AnalyticsEvent): Promise<void> {
    if (!window.posthog) return;
    
    try {
      window.posthog.capture(event.name, event.properties);
    } catch (error) {
      logger.error("[ANALYTICS] PostHog tracking error", {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // ================ QUEUE PROCESSING ================

  private async processQueue(): Promise<void> {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        await this.sendEvent(event).catch(() => {});
      }
    }
  }

  private async flush(): Promise<void> {
    if (!this.initialized) return;
    await this.processQueue();
  }

  // ================ USER IDENTIFICATION ================

  identify(userId: string, traits?: Record<string, any>): void {
    if (!isBrowser()) return;

    this.userId = userId;
    
    const config = this.getConfig();
    
    if (config.providers.includes('mixpanel') && window.mixpanel) {
      try {
        window.mixpanel.identify(userId);
        if (traits) {
          window.mixpanel.people.set(traits);
        }
      } catch (error) {
        logger.error("[ANALYTICS] Mixpanel identify error", {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    if (config.providers.includes('posthog') && window.posthog) {
      try {
        window.posthog.identify(userId, traits);
      } catch (error) {
        logger.error("[ANALYTICS] PostHog identify error", {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    if (config.providers.includes('google') && window.gtag && config.googleTrackingId) {
      try {
        window.gtag('config', config.googleTrackingId, {
          user_id: userId
        });
      } catch (error) {
        logger.error("[ANALYTICS] Google Analytics identify error", {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  // ================ UTILITIES ================

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private setupEventListeners(): void {
    if (!isBrowser()) return;

    try {
      // Track page views
      let currentUrl = window.location.href;
      
      // Track navigation changes (for SPAs)
      this.mutationObserver = new MutationObserver(() => {
        if (currentUrl !== window.location.href) {
          currentUrl = window.location.href;
          this.track('page_view', {
            url: currentUrl,
            title: document.title,
            referrer: document.referrer
          });
        }
      });

      this.mutationObserver.observe(document, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['title']
      });

      // Track before unload
      window.addEventListener('beforeunload', () => {
        this.flush().catch(() => {});
      });

      // Track visibility changes
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flush().catch(() => {});
        }
      });

    } catch (error) {
      logger.error("[ANALYTICS] Failed to setup event listeners", {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // ================ CLEANUP ================

  destroy(): void {
    if (this.flushTimerId !== null) {
      clearInterval(this.flushTimerId);
      this.flushTimerId = null;
    }

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }

    this.flush().catch(() => {});
  }
}

// ================ EXPORTS ================

export const bootstrapAnalytics = async (): Promise<void> => {
  const bootstrapper = AnalyticsBootstrapper.getInstance();
  await bootstrapper.bootstrap();
};

// Export singleton instance for direct use
export const analytics = AnalyticsBootstrapper.getInstance();

// Export class for testing
export { AnalyticsBootstrapper };