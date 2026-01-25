import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ENV } from "../../config/env";
import { JwtPayload } from "../../types/auth";

/**
 * -------------------------
 * Sign ACCESS token
 * -------------------------
 */
export const signAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(
    payload,
    ENV.JWT_ACCESS_SECRET as jwt.Secret,
    {
      expiresIn: ENV.JWT_ACCESS_EXPIRES_IN as any,
    }
  );
};

/**
 * -------------------------
 * Sign REFRESH token
 * -------------------------
 * 🔥 FIX: add `jti` to avoid duplicate refresh tokens
 */
export const signRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(
    {
      ...payload,
      jti: crypto.randomUUID(), // ✅ ensures uniqueness
    },
    ENV.JWT_REFRESH_SECRET as jwt.Secret,
    {
      expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as any,
    }
  );
};

/**
 * -------------------------
 * Verify ACCESS token
 * -------------------------
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(
    token,
    ENV.JWT_ACCESS_SECRET as jwt.Secret
  ) as JwtPayload;
};
