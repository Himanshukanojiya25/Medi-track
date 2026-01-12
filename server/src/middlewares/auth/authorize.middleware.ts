import { Request, Response, NextFunction } from "express";

/**
 * Allowed RBAC roles (kebab-case only)
 */
export type AppRole =
  | "super-admin"
  | "hospital-admin"
  | "doctor"
  | "patient"
  | "hospital";

/**
 * Role-based authorization middleware
 */
export const authorize =
  (...allowedRoles: AppRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userRole = req.user.role as AppRole;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
