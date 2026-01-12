import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/env";
import { JwtPayload } from "../../types/auth";

/**
 * JWT Authentication Middleware
 * -----------------------------
 * - Verifies access token
 * - Injects normalized req.user
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
     * 3️⃣ Normalize role
     * SUPER_ADMIN  -> super-admin
     * HOSPITAL_ADMIN -> hospital-admin
     */
    const normalizedRole = decoded.role
      .toLowerCase()
      .replace(/_/g, "-");

    /**
     * 4️⃣ Inject req.user (🔥 SINGLE SOURCE OF TRUTH)
     */
    req.user = {
      id: decoded.id,
      role: normalizedRole,
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
