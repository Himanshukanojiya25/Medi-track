// src/middlewares/ai/ai-safety.middleware.ts

import { Request, Response, NextFunction } from "express";

/**
 * AI Safety Middleware
 * -------------------
 * Responsibilities:
 * - Protect AI system from malformed / abusive requests
 * - Enforce basic payload safety rules
 * - Act as final defensive layer before AI execution
 *
 * IMPORTANT:
 * - No DB access
 * - No AI provider calls
 * - No business logic
 *
 * This middleware MUST stay cheap and predictable.
 */
export const aiSafetyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * Only inspect JSON bodies (defensive)
   */
  const body = req.body;

  if (!body || typeof body !== "object") {
    res.status(400).json({
      success: false,
      error: {
        code: "AI_INVALID_PAYLOAD",
        message: "Invalid AI request payload",
      },
    });
    return;
  }

  /**
   * Prompt / input size guard
   * (hard safety cap — protects memory & provider abuse)
   */
  const input =
    body.prompt ||
    body.message ||
    body.input ||
    body.query;

  if (typeof input === "string") {
    const MAX_INPUT_LENGTH = 4000; // chars (safe, cheap)

    if (input.length === 0) {
      res.status(400).json({
        success: false,
        error: {
          code: "AI_EMPTY_INPUT",
          message: "AI input cannot be empty",
        },
      });
      return;
    }

    if (input.length > MAX_INPUT_LENGTH) {
      res.status(413).json({
        success: false,
        error: {
          code: "AI_INPUT_TOO_LARGE",
          message: "AI input exceeds allowed size",
        },
      });
      return;
    }
  }

  /**
   * Optional future hook:
   * - keyword blacklist
   * - intent allowlist
   * - role-based input rules
   *
   * (intentionally NOT implemented here)
   */

  next();
};
