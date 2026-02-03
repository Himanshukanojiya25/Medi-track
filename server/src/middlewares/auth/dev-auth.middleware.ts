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
    id: "69601aabfc7a199f1749919d",
    role: "hospital-admin",
    hospitalId: "69601aabfc7a199f1749919e",
  } as any;

  next();
}
