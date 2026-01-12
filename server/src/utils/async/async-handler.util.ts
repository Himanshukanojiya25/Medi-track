// src/utils/async/async-handler.util.ts

import { Request, Response, NextFunction } from "express";

/**
 * Wrap async route handlers
 * Automatically forwards errors to Express error middleware
 */
export const asyncHandler =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
