/**
 * @fileoverview Session Service - Enterprise Grade Session Management
 * @module services/auth/session.service
 * 
 * Features:
 * - Session tracking and management
 * - Multi-device session handling
 * - Session timeout management
 * - Session activity monitoring
 * - Device fingerprinting
 */

import { tokenService } from './token.service';
import AuthService from './auth.service';

// ============================================================================
// TYPES
// ============================================================================

export interface Session {
  id: string;
  userId: string;
  deviceInfo: DeviceInfo;
  createdAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
  isActive: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  browser: string;
  os: string;
  isMobile: boolean;
}

export interface SessionActivity {
  type: 'login' | 'logout' | 'token_refresh' | 'api_call' | 'session_expired';
  timestamp: Date;
  details?: Record<string, any>;
}

export interface SessionConfig {
  sessionTimeoutMinutes: number;
  idleTimeoutMinutes: number;
  maxConcurrentSessions: number;
  enableActivityTracking: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEYS = {
  SESSION_ID: 'session_id',
  SESSION_ACTIVITY: 'session_activity',
  LAST_ACTIVITY: 'last_activity',
  DEVICE_INFO: 'device_info',
} as const;

const DEFAULT_CONFIG: SessionConfig = {
  sessionTimeoutMinutes: 720, // 12 hours
  idleTimeoutMinutes: 30, // 30 minutes
  maxConcurrentSessions: 5,
  enableActivityTracking: true,
};

// ============================================================================
// SESSION SERVICE CLASS
// ============================================================================

export class SessionService {
  private static instance: SessionService;
  private config: SessionConfig;
  private activityListeners: Array<(activity: SessionActivity) => void> = [];
  private idleTimer: NodeJS.Timeout | null = null;
  private sessionTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.config = { ...DEFAULT_CONFIG };
    this.initialize();
  }

  static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  private initialize(): void {
    // Load device info
    this.loadDeviceInfo();
    
    // Setup activity tracking
    if (this.config.enableActivityTracking) {
      this.setupActivityTracking();
    }
    
    // Check existing session
    this.checkExistingSession();
  }

  /**
   * Load or generate device info
   */
  private loadDeviceInfo(): void {
    const stored = localStorage.getItem(STORAGE_KEYS.DEVICE_INFO);
    if (stored) {
      try {
        const deviceInfo = JSON.parse(stored);
        if (this.validateDeviceInfo(deviceInfo)) {
          return;
        }
      } catch {
        // Invalid stored data, generate new
      }
    }
    
    const deviceInfo = this.generateDeviceInfo();
    localStorage.setItem(STORAGE_KEYS.DEVICE_INFO, JSON.stringify(deviceInfo));
  }

  /**
   * Generate device fingerprint
   */
  private generateDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    // Detect device type
    let deviceType: DeviceInfo['deviceType'] = 'unknown';
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(userAgent)) {
      deviceType = 'tablet';
    } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
      deviceType = 'mobile';
    } else {
      deviceType = 'desktop';
    }
    
    // Detect browser
    let browser = 'Unknown';
    if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
    else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';
    
    // Detect OS
    let os = 'Unknown';
    if (userAgent.indexOf('Windows') > -1) os = 'Windows';
    else if (userAgent.indexOf('Mac') > -1) os = 'MacOS';
    else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
    else if (userAgent.indexOf('Android') > -1) os = 'Android';
    else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1) os = 'iOS';
    
    return {
      deviceId: this.generateDeviceId(),
      deviceName: `${os} ${deviceType}`,
      deviceType,
      browser,
      os,
      isMobile: deviceType === 'mobile',
    };
  }

  /**
   * Generate unique device ID
   */
  private generateDeviceId(): string {
    const stored = localStorage.getItem('device_id');
    if (stored) return stored;
    
    const deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('device_id', deviceId);
    return deviceId;
  }

  /**
   * Validate device info
   */
  private validateDeviceInfo(info: any): boolean {
    return info && 
           typeof info.deviceId === 'string' &&
           typeof info.deviceName === 'string' &&
           ['mobile', 'tablet', 'desktop', 'unknown'].includes(info.deviceType);
  }

  // ==========================================================================
  // ACTIVITY TRACKING
  // ==========================================================================

  /**
   * Setup activity tracking listeners
   */
  private setupActivityTracking(): void {
    const events = ['click', 'keydown', 'scroll', 'mousemove', 'touchstart'];
    
    const trackActivity = () => {
      this.updateLastActivity();
      this.resetIdleTimer();
    };
    
    events.forEach(event => {
      window.addEventListener(event, trackActivity);
    });
  }

  /**
   * Update last activity timestamp
   */
  private updateLastActivity(): void {
    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, now);
  }

  /**
   * Get last activity timestamp
   */
  getLastActivity(): Date | null {
    const lastActivity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
    return lastActivity ? new Date(lastActivity) : null;
  }

  /**
   * Reset idle timer
   */
  private resetIdleTimer(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }
    
    this.idleTimer = setTimeout(() => {
      this.onIdleTimeout();
    }, this.config.idleTimeoutMinutes * 60 * 1000);
  }

  /**
   * Handle idle timeout
   */
  private onIdleTimeout(): void {
    console.log('Session idle timeout');
    this.trackActivity({
      type: 'session_expired',
      timestamp: new Date(),
      details: { reason: 'idle_timeout' },
    });
    this.endSession('Session expired due to inactivity');
  }

  // ==========================================================================
  // SESSION MANAGEMENT
  // ==========================================================================

  /**
   * Start new session
   */
  async startSession(userId: string): Promise<Session> {
    const deviceInfo = this.getDeviceInfo();
    
    const session: Session = {
      id: this.generateSessionId(),
      userId,
      deviceInfo,
      createdAt: new Date(),
      lastActivityAt: new Date(),
      expiresAt: new Date(Date.now() + this.config.sessionTimeoutMinutes * 60 * 1000),
      isActive: true,
    };
    
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, session.id);
    this.trackActivity({
      type: 'login',
      timestamp: new Date(),
      details: { sessionId: session.id },
    });
    
    this.startSessionTimer();
    this.resetIdleTimer();
    
    return session;
  }

  /**
   * End current session
   */
  async endSession(reason?: string): Promise<void> {
    const sessionId = this.getSessionId();
    
    if (sessionId) {
      this.trackActivity({
        type: 'logout',
        timestamp: new Date(),
        details: { sessionId, reason },
      });
    }
    
    localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
    localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
    
    this.clearTimers();
  }

  /**
   * Check existing session
   */
  private checkExistingSession(): void {
    const sessionId = this.getSessionId();
    const lastActivity = this.getLastActivity();
    
    if (sessionId && lastActivity) {
      const idleTime = Date.now() - lastActivity.getTime();
      const isIdle = idleTime > this.config.idleTimeoutMinutes * 60 * 1000;
      
      if (isIdle) {
        this.endSession('Session expired due to inactivity');
      } else {
        this.startSessionTimer();
      }
    }
  }

  /**
   * Start session timer
   */
  private startSessionTimer(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
    
    this.sessionTimer = setTimeout(() => {
      this.onSessionTimeout();
    }, this.config.sessionTimeoutMinutes * 60 * 1000);
  }

  /**
   * Handle session timeout
   */
  private onSessionTimeout(): void {
    console.log('Session timeout');
    this.trackActivity({
      type: 'session_expired',
      timestamp: new Date(),
      details: { reason: 'session_timeout' },
    });
    this.endSession('Session expired');
  }

  /**
   * Clear all timers
   */
  private clearTimers(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
  }

  // ==========================================================================
  // SESSION VALIDATION
  // ==========================================================================

  /**
   * Validate current session
   */
  isSessionValid(): boolean {
    const sessionId = this.getSessionId();
    const lastActivity = this.getLastActivity();
    const token = tokenService.getAccessToken();
    
    if (!sessionId || !token) return false;
    
    // Check token expiry
    if (tokenService.isTokenExpired(token)) return false;
    
    // Check idle timeout
    if (lastActivity) {
      const idleTime = Date.now() - lastActivity.getTime();
      if (idleTime > this.config.idleTimeoutMinutes * 60 * 1000) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Refresh session
   */
  async refreshSession(): Promise<void> {
    if (!this.isSessionValid()) {
      await this.endSession('Session invalid');
    }
    
    this.updateLastActivity();
    this.resetIdleTimer();
    
    this.trackActivity({
      type: 'token_refresh',
      timestamp: new Date(),
    });
  }

  // ==========================================================================
  // GETTERS
  // ==========================================================================

  /**
   * Get current session ID
   */
  getSessionId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.SESSION_ID);
  }

  /**
   * Get device info
   */
  getDeviceInfo(): DeviceInfo {
    const stored = localStorage.getItem(STORAGE_KEYS.DEVICE_INFO);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fall through to generate
      }
    }
    return this.generateDeviceInfo();
  }

  /**
   * Get session config
   */
  getConfig(): SessionConfig {
    return { ...this.config };
  }

  /**
   * Update session config
   */
  updateConfig(config: Partial<SessionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // ==========================================================================
  // ACTIVITY TRACKING
  // ==========================================================================

  /**
   * Track session activity
   */
  trackActivity(activity: SessionActivity): void {
    const activities = this.getActivityHistory();
    activities.push(activity);
    
    // Keep only last 100 activities
    if (activities.length > 100) {
      activities.shift();
    }
    
    localStorage.setItem(STORAGE_KEYS.SESSION_ACTIVITY, JSON.stringify(activities));
    
    // Notify listeners
    this.activityListeners.forEach(listener => listener(activity));
  }

  /**
   * Get activity history
   */
  getActivityHistory(): SessionActivity[] {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSION_ACTIVITY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  }

  /**
   * Add activity listener
   */
  addActivityListener(listener: (activity: SessionActivity) => void): void {
    this.activityListeners.push(listener);
  }

  /**
   * Remove activity listener
   */
  removeActivityListener(listener: (activity: SessionActivity) => void): void {
    const index = this.activityListeners.indexOf(listener);
    if (index > -1) {
      this.activityListeners.splice(index, 1);
    }
  }

  // ==========================================================================
  // UTILITIES
  // ==========================================================================

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Clear all session data
   */
  clearAllSessionData(): void {
    this.clearTimers();
    localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
    localStorage.removeItem(STORAGE_KEYS.SESSION_ACTIVITY);
    localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
    // Don't clear device info, keep for next session
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const sessionService = SessionService.getInstance();
export default sessionService;