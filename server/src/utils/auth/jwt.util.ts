import jwt from "jsonwebtoken";
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
      expiresIn: ENV.JWT_ACCESS_EXPIRES_IN as any, // 🔥 FIX
    }
  );
};

/**
 * -------------------------
 * Sign REFRESH token
 * -------------------------
 */
export const signRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(
    payload,
    ENV.JWT_REFRESH_SECRET as jwt.Secret,
    {
      expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as any, // 🔥 FIX
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
