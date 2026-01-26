import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { ENV } from "../../config/env";
import { JwtPayload } from "../../types/auth";
import { ROLES, Role } from "../../constants/roles";

/**
 * JWT Authentication Middleware
 * -----------------------------
 * - Verifies access token
 * - Injects req.user
 * - Uses UPPERCASE role enums only (🔥 SINGLE SOURCE OF TRUTH)
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  /**
   * 1️⃣ Authorization header check
   */
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authorization token missing",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    /**
     * 2️⃣ Verify JWT
     */
    const decoded = jwt.verify(
      token,
      ENV.JWT_ACCESS_SECRET
    ) as JwtPayload;

    /**
     * 3️⃣ Normalize role (🔥 BACKEND = UPPERCASE ONLY)
     */
    const normalizedRole = decoded.role.toUpperCase() as Role;

    /**
     * 4️⃣ Safety check (role must be valid enum)
     */
    if (!Object.values(ROLES).includes(normalizedRole)) {
      res.status(401).json({
        success: false,
        message: "Invalid role",
      });
      return;
    }

    /**
     * 5️⃣ Inject req.user (🔥 SINGLE SOURCE OF TRUTH)
     */
    req.user = {
      id: decoded.id,
      role: normalizedRole, // ✅ SUPER_ADMIN
      hospitalId: decoded.hospitalId,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
