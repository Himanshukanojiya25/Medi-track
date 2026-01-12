import { Request, Response, NextFunction } from "express";

/**
 * DEV ONLY AUTH MIDDLEWARE
 * Uses FIXED ObjectIds so session ownership stays consistent
 */
export function devAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  req.user = {
    id: "69601aabfc7a199f1749919d",          // 🔒 FIXED ADMIN USER ID
    role: "hospital-admin",                 // ✅ REQUIRED ROLE
    hospitalId: "69601aabfc7a199f1749919e",  // 🔒 FIXED HOSPITAL ID
  } as any;

  next();
}
