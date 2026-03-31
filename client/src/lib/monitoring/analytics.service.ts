/**
 * @fileoverview Analytics Service
 * @module lib/monitoring/analytics.service
 * @description Enterprise-grade analytics tracking with:
 * - Event tracking (clicks, conversions, custom events)
 * - Page view tracking
 * - User identification
 * - Session management
 * - Multiple analytics providers (Google Analytics, Mixpanel, etc.)
 * - Offline queue
 * - Privacy-compliant
 * 
 * @version 2.0.0
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface PageView {
  path: string;
  title?: string;
  referrer?: string;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface UserIdentity {
  userId: string;
  traits?: Record<string, any>;
  timestamp?: number;
}

export interface AnalyticsConfig {
  enabled?: boolean;
  debug?: boolean;
  providers?: AnalyticsProvider[];
  trackPageViews?: boolean;
  trackClicks?: boolean;
  anonymizeIp?: boolean;
  respectDoNotTrack?: boolean;
  sessionTimeout?: number; // milliseconds
}

export interface AnalyticsProvider {
  name: string;
  initialize(): Promise<void> | void;
  track(event: AnalyticsEvent): Promise<void> | void;
  page(pageView: PageView): Promise<void> | void;
  identify(identity: UserIdentity): Promise<void> | void;
}

// ============================================================================
// SESSION MANAGER
// ============================================================================

class SessionManager {
  private static SESSION_KEY = 'analytics_session';
  private static SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  
  private sessionId: string | null = null;
  private lastActivity: number = Date.now();

  constructor(timeout?: number) {
    if (timeout) {
      SessionManager.SESSION_TIMEOUT = timeout;
    }
    this.loadSession();
    this.setupActivityTracking();
  }

  getSessionId(): string {
    if (!this.sessionId || this.isSessionExpired()) {
      this.createNewSession();
    }
    return this.sessionId!;
  }

  private loadSession(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = sessionStorage.getItem(SessionManager.SESSION_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (!this.isExpired(data.lastActivity)) {
          this.sessionId = data.sessionId;
          this.lastActivity = data.lastActivity;
        }
      }
    } catch (error) {
      console.warn('[Analytics] Failed to load session:', error);
    }
  }

  private saveSession(): void {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.setItem(SessionManager.SESSION_KEY, JSON.stringify({
        sessionId: this.sessionId,
        lastActivity: this.lastActivity
      }));
    } catch (error) {
      console.warn('[Analytics] Failed to save session:', error);
    }
  }

  private createNewSession(): void {
    this.sessionId = this.generateSessionId();
    this.lastActivity = Date.now();
    this.saveSession();
  }

  private isSessionExpired(): boolean {
    return this.isExpired(this.lastActivity);
  }

  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > SessionManager.SESSION_TIMEOUT;
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private setupActivityTracking(): void {
    if (typeof window === 'undefined') return;

    const updateActivity = () => {
      this.lastActivity = Date.now();
      this.saveSession();
    };

    ['click', 'scroll', 'keydown', 'mousemove'].forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true, once: false });
    });
  }
}

// ============================================================================
// ANALYTICS QUEUE
// ============================================================================

class AnalyticsQueue {
  private static QUEUE_KEY = 'analytics_queue';
  private queue: Array<{ type: 'event' | 'page' | 'identify'; data: any }> = [];
  private maxSize = 100;

  constructor() {
    this.loadQueue();
  }

  enqueue(type: 'event' | 'page' | 'identify', data: any): void {
    this.queue.push({ type, data });
    
    // Limit queue size
    if (this.queue.length > this.maxSize) {
      this.queue = this.queue.slice(-this.maxSize);
    }
    
    this.saveQueue();
  }

  dequeue(): Array<{ type: 'event' | 'page' | 'identify'; data: any }> {
    const items = [...this.queue];
    this.queue = [];
    this.saveQueue();
    return items;
  }

  size(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
    this.saveQueue();
  }

  private loadQueue(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(AnalyticsQueue.QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('[Analytics] Failed to load queue:', error);
    }
  }

  private saveQueue(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(AnalyticsQueue.QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.warn('[Analytics] Failed to save queue:', error);
    }
  }
}

// ============================================================================
// BUILT-IN PROVIDERS
// ============================================================================

/**
 * Console Provider - Logs to console (for development)
 */
export class ConsoleProvider implements AnalyticsProvider {
  name = 'console';

  initialize(): void {
    console.log('[Analytics] Console provider initialized');
  }

  track(event: AnalyticsEvent): void {
    console.log('📊 [Analytics] Event:', event.name, event.properties);
  }

  page(pageView: PageView): void {
    console.log('📄 [Analytics] Page View:', pageView.path, pageView.title);
  }

  identify(identity: UserIdentity): void {
    console.log('👤 [Analytics] Identify:', identity.userId, identity.traits);
  }
}

/**
 * Google Analytics Provider
 */
export class GoogleAnalyticsProvider implements AnalyticsProvider {
  name = 'google-analytics';
  private measurementId: string;

  constructor(measurementId: string) {
    this.measurementId = measurementId;
  }

  initialize(): void {
    if (typeof window === 'undefined') return;

    // Load gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(arguments);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', this.measurementId);
  }

  track(event: AnalyticsEvent): void {
    if (typeof window === 'undefined' || !(window as any).gtag) return;

    (window as any).gtag('event', event.name, event.properties);
  }

  page(pageView: PageView): void {
    if (typeof window === 'undefined' || !(window as any).gtag) return;

    (window as any).gtag('config', this.measurementId, {
      page_path: pageView.path,
      page_title: pageView.title
    });
  }

  identify(identity: UserIdentity): void {
    if (typeof window === 'undefined' || !(window as any).gtag) return;

    (window as any).gtag('config', this.measurementId, {
      user_id: identity.userId,
      user_properties: identity.traits
    });
  }
}

// ============================================================================
// ANALYTICS SERVICE CLASS
// ============================================================================

export class AnalyticsService {
  private static instance: AnalyticsService;
  
  private config: Required<AnalyticsConfig>;
  private providers: AnalyticsProvider[] = [];
  private sessionManager: SessionManager;
  private queue: AnalyticsQueue;
  private userId: string | null = null;
  private isInitialized = false;

  private constructor(config: AnalyticsConfig = {}) {
    this.config = {
      enabled: true,
      debug: false,
      providers: [],
      trackPageViews: true,
      trackClicks: false,
      anonymizeIp: true,
      respectDoNotTrack: true,
      sessionTimeout: 30 * 60 * 1000,
      ...config
    };

    this.sessionManager = new SessionManager(this.config.sessionTimeout);
    this.queue = new AnalyticsQueue();
    
    if (this.shouldTrack()) {
      this.initialize();
    }
  }

  static getInstance(config?: AnalyticsConfig): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService(config);
    }
    return AnalyticsService.instance;
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Add default console provider in debug mode
    if (this.config.debug) {
      this.addProvider(new ConsoleProvider());
    }

    // Add configured providers
    for (const provider of this.config.providers || []) {
      this.addProvider(provider);
    }

    // Initialize all providers
    await Promise.all(
      this.providers.map(provider => 
        Promise.resolve(provider.initialize()).catch(error => {
          console.error(`[Analytics] Failed to initialize ${provider.name}:`, error);
        })
      )
    );

    // Process queued events
    this.processQueue();

    // Setup automatic page tracking
    if (this.config.trackPageViews) {
      this.setupPageTracking();
    }

    // Setup click tracking
    if (this.config.trackClicks) {
      this.setupClickTracking();
    }

    this.isInitialized = true;

    this.log('Analytics initialized', {
      providers: this.providers.map(p => p.name),
      sessionId: this.sessionManager.getSessionId()
    });
  }

  // ============================================================================
  // EVENT TRACKING
  // ============================================================================

  /**
   * Track custom event
   */
  track(eventName: string, properties?: Record<string, any>): void {
    if (!this.shouldTrack()) return;

    const event: AnalyticsEvent = {
      name: eventName,
      properties: properties || {},
      timestamp: Date.now(),
      userId: this.userId || undefined,
      sessionId: this.sessionManager.getSessionId()
    };

    this.log('Track event:', event);

    if (!this.isInitialized) {
      this.queue.enqueue('event', event);
      return;
    }

    this.sendToProviders('track', event);
  }

  /**
   * Track page view
   */
  page(path?: string, title?: string, properties?: Record<string, any>): void {
    if (!this.shouldTrack()) return;

    const pageView: PageView = {
      path: path || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      title: title || (typeof document !== 'undefined' ? document.title : undefined),
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      timestamp: Date.now(),
      userId: this.userId || undefined,
      sessionId: this.sessionManager.getSessionId(),
      ...properties
    };

    this.log('Page view:', pageView);

    if (!this.isInitialized) {
      this.queue.enqueue('page', pageView);
      return;
    }

    this.sendToProviders('page', pageView);
  }

  /**
   * Identify user
   */
  identify(userId: string, traits?: Record<string, any>): void {
    if (!this.shouldTrack()) return;

    this.userId = userId;

    const identity: UserIdentity = {
      userId,
      traits: traits || {},
      timestamp: Date.now()
    };

    this.log('Identify user:', identity);

    if (!this.isInitialized) {
      this.queue.enqueue('identify', identity);
      return;
    }

    this.sendToProviders('identify', identity);
  }

  /**
   * Reset user identity
   */
  reset(): void {
    this.userId = null;
    this.log('User identity reset');
  }

  // ============================================================================
  // CONVENIENCE METHODS
  // ============================================================================

  /**
   * Track button click
   */
  trackClick(buttonName: string, properties?: Record<string, any>): void {
    this.track('button_clicked', {
      button: buttonName,
      ...properties
    });
  }

  /**
   * Track form submission
   */
  trackFormSubmit(formName: string, properties?: Record<string, any>): void {
    this.track('form_submitted', {
      form: formName,
      ...properties
    });
  }

  /**
   * Track search
   */
  trackSearch(query: string, properties?: Record<string, any>): void {
    this.track('search', {
      query,
      ...properties
    });
  }

  /**
   * Track purchase/conversion
   */
  trackPurchase(amount: number, properties?: Record<string, any>): void {
    this.track('purchase', {
      amount,
      currency: 'USD',
      ...properties
    });
  }

  /**
   * Track signup
   */
  trackSignup(method?: string, properties?: Record<string, any>): void {
    this.track('signup', {
      method: method || 'email',
      ...properties
    });
  }

  /**
   * Track login
   */
  trackLogin(method?: string, properties?: Record<string, any>): void {
    this.track('login', {
      method: method || 'email',
      ...properties
    });
  }

  // ============================================================================
  // PROVIDER MANAGEMENT
  // ============================================================================

  addProvider(provider: AnalyticsProvider): void {
    if (this.providers.some(p => p.name === provider.name)) {
      console.warn(`[Analytics] Provider ${provider.name} already exists`);
      return;
    }

    this.providers.push(provider);

    if (this.isInitialized) {
      Promise.resolve(provider.initialize()).catch(error => {
        console.error(`[Analytics] Failed to initialize ${provider.name}:`, error);
      });
    }
  }

  removeProvider(name: string): void {
    this.providers = this.providers.filter(p => p.name !== name);
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private shouldTrack(): boolean {
    if (!this.config.enabled) return false;

    // Respect Do Not Track
    if (this.config.respectDoNotTrack && typeof navigator !== 'undefined') {
      const dnt = (navigator as any).doNotTrack || (window as any).doNotTrack;
      if (dnt === '1' || dnt === 'yes') {
        return false;
      }
    }

    return true;
  }

  private sendToProviders(method: 'track' | 'page' | 'identify', data: any): void {
    this.providers.forEach(provider => {
      try {
        provider[method](data);
      } catch (error) {
        console.error(`[Analytics] Provider ${provider.name} failed:`, error);
      }
    });
  }

  private processQueue(): void {
    const items = this.queue.dequeue();
    
    items.forEach(item => {
      switch (item.type) {
        case 'event':
          this.sendToProviders('track', item.data);
          break;
        case 'page':
          this.sendToProviders('page', item.data);
          break;
        case 'identify':
          this.sendToProviders('identify', item.data);
          break;
      }
    });

    if (items.length > 0) {
      this.log(`Processed ${items.length} queued analytics events`);
    }
  }

  private setupPageTracking(): void {
    if (typeof window === 'undefined') return;

    // Track initial page view
    this.page();

    // Track page changes (for SPAs)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.page();
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.page();
    };

    window.addEventListener('popstate', () => {
      this.page();
    });
  }

  private setupClickTracking(): void {
    if (typeof window === 'undefined') return;

    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      // Track button clicks
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button')!;
        const label = button.textContent?.trim() || button.getAttribute('aria-label') || 'unknown';
        this.trackClick(label, {
          element: 'button',
          id: button.id,
          class: button.className
        });
      }
      
      // Track link clicks
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.tagName === 'A' ? target as HTMLAnchorElement : target.closest('a')!;
        this.track('link_clicked', {
          href: link.href,
          text: link.textContent?.trim(),
          external: link.hostname !== window.location.hostname
        });
      }
    }, { passive: true });
  }

  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[Analytics]', ...args);
    }
  }

  /**
   * Get current session ID
   */
  getSessionId(): string {
    return this.sessionManager.getSessionId();
  }

  /**
   * Get current user ID
   */
  getUserId(): string | null {
    return this.userId;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// ============================================================================
// SINGLETON INSTANCE & EXPORTS
// ============================================================================

export const analytics = AnalyticsService.getInstance();

export const track = (eventName: string, properties?: Record<string, any>) => 
  analytics.track(eventName, properties);

export const page = (path?: string, title?: string, properties?: Record<string, any>) => 
  analytics.page(path, title, properties);

export const identify = (userId: string, traits?: Record<string, any>) => 
  analytics.identify(userId, traits);

export const reset = () => analytics.reset();

export default analytics;