import { Request, Response, NextFunction } from "express";
import { Role } from "../../types/auth";

/**
 * -------------------------
 * Role Based Access Control
 * -------------------------
 * Usage:
 *   requireRole("SUPER_ADMIN")
 *   requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN")
 */
export const requireRole =
  (...allowedRoles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    /**
     * Safety: auth middleware must run before this
     */
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /**
     * 🔒 Canonical role from JWT
     * Runtime guarantee: always valid Role
     * TS fix: explicit assertion
     */
    const userRole = req.user.role as Role;

    /**
     * 🔍 Debug (optional)
     */
    console.log("==== RBAC DEBUG ====");
    console.log("req.user:", req.user);
    console.log("userRole:", userRole);
    console.log("allowedRoles:", allowedRoles);
    console.log("====================");

    /**
     * ❌ Access denied if role not allowed
     */
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    /**
     * ✅ Role allowed
     */
    next();
  };
