import { Request, Response, NextFunction } from "express";
import { AUTH_ERROR_MESSAGES } from "../../constants/auth";
import { Role } from "../../constants/roles";

/**
 * RBAC Middleware
 */
export function rbac(allowedRoles: readonly Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user; // ✅ RequestUser | undefined

    if (!user) {
      res.status(401).json({
        success: false,
        message: AUTH_ERROR_MESSAGES.UNAUTHORIZED,
      });
      return;
    }

    // 🔥 THIS LINE WILL NOW WORK
    if (!allowedRoles.includes(user.role as Role)) {
      res.status(403).json({
        success: false,
        message: AUTH_ERROR_MESSAGES.FORBIDDEN,
      });
      return;
    }

    next();
  };
}
