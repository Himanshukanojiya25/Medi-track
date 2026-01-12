// src/middlewares/request/validate-request.middleware.ts

import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError, ZodIssue } from "zod";

/**
 * validateRequest Middleware
 * --------------------------
 * Validates req.body / req.params / req.query
 * using Zod schemas
 *
 * Fully compatible with Zod v3 + TS strict mode
 */
export default function validateRequest(
  schema: ZodSchema
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (err) {
      /**
       * TS-safe narrowing for ZodError
       */
      if (err instanceof ZodError) {
        const formattedErrors = err.issues.map(
          (issue: ZodIssue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })
        );

        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: formattedErrors,
        });
        return;
      }

      next(err);
    }
  };
}
