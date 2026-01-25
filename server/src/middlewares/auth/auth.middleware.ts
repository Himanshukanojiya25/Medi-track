import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { AUTH_ERROR_MESSAGES } from "../../constants/auth";
import { Role, ROLES } from "../../constants/roles";
import { JwtPayload } from "../../types/auth";

/**
 * REAL AUTH MIDDLEWARE
 * -------------------
 * - Verifies access token
 * - Injects req.user
 * - Enforces authenticated access
 *
 * ✅ Normalizes role (UPPERCASE)
 * ❌ No dev shortcuts
 * ❌ No hardcoded user
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // 1️⃣ Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: AUTH_ERROR_MESSAGES.UNAUTHORIZED,
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as JwtPayload;

    // 3️⃣ Validate decoded payload
    if (!decoded?.id || !decoded?.role) {
      res.status(401).json({
        success: false,
        message: AUTH_ERROR_MESSAGES.UNAUTHORIZED,
      });
      return;
    }

    // 4️⃣ Normalize role (🔥 IMPORTANT)
    const normalizedRole = decoded.role.toUpperCase() as Role;

    // Optional safety check (extra hardening)
    if (!Object.values(ROLES).includes(normalizedRole)) {
      res.status(401).json({
        success: false,
        message: AUTH_ERROR_MESSAGES.UNAUTHORIZED,
      });
      return;
    }

    // 5️⃣ Attach req.user (SINGLE SOURCE OF TRUTH)
    req.user = {
      id: decoded.id,
      role: normalizedRole,
      hospitalId: decoded.hospitalId,
    };

    // 6️⃣ Continue
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: AUTH_ERROR_MESSAGES.UNAUTHORIZED,
    });
  }
}
