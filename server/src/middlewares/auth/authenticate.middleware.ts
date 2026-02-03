import { Request, Response, NextFunction } from "express";

export default function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const testUser = req.headers["x-test-user"];

  if (testUser) {
    try {
      req.user = JSON.parse(
        typeof testUser === "string"
          ? testUser
          : testUser[0]
      );
      next();
      return;
    } catch {
      res.status(401).json({
        success: false,
        message: "Invalid test user",
      });
      return; // ✅ explicit void return
    }
  }

  // ❌ Unauthorized
  res.status(401).json({
    success: false,
    message: "Unauthorized",
  });
  return; // ✅ important
}
