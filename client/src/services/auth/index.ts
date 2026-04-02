/**
 * @fileoverview Auth Services - Enterprise Grade Authentication
 * @module services/auth
 */

// Core auth service
export { default as AuthService } from './auth.service';
export type { 
  LoginRequest, 
  RegisterRequest, 
  LoginResponseData, 
  AuthUser 
} from './auth.service';

// Token management
export { tokenService, TokenService } from './token.service';
export type { TokenPayload, TokenPair, StoredTokens } from './token.service';

// Session management
export { sessionService, SessionService } from './session.service';
export type { 
  Session, 
  DeviceInfo, 
  SessionActivity, 
  SessionConfig 
} from './session.service';