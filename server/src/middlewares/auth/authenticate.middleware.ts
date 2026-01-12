import { Request, Response, NextFunction } from "express";

/**
 * Authenticate Middleware (DEV MODE)
 * ---------------------------------
 * Temporary mock authentication
 *
 * NOTE:
 * - This is ONLY for development / testing
 * - Replace with real JWT logic later
 */
export default function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  /**
   * 🔥 MOCK USER (FAKE LOGIN)
   * This simulates a logged-in user
   */
  req.user = {
    id: "66cf1234abcd5678ef901234",
    role: "patient", // try changing to: doctor | hospital-admin | super-admin
    hospitalId: "66cf9999abcd5678ef901111",
  };

  next();
}
