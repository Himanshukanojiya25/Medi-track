import { Request, Response, NextFunction } from "express";

/**
 * Hospital Context Middleware
 * ---------------------------
 * Ensures hospital isolation for non super-admin users
 */
export default function hospitalContext(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  // Super admin bypass
  if (req.user.role === "super-admin") {
    next();
    return;
  }

  if (!req.user.hospitalId) {
    res.status(400).json({
      success: false,
      message: "Hospital context missing",
    });
    return;
  }

  next();
}
