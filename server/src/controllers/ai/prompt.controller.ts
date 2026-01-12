// src/controllers/ai/prompt.controller.ts

import { Request, Response, NextFunction } from "express";
import { PromptResolverService } from "../../services/ai";

/**
 * PromptController
 * ------------------------------------------------
 * AI Prompt Governance Controller
 *
 * Access:
 * - SUPER ADMIN ONLY
 *
 * Responsibilities:
 * - View active prompt snapshot
 * - Preview resolved prompts
 * - Update prompt content (in-memory, versioning later)
 *
 * NOTE:
 * - RBAC middleware should ALSO be applied at route level
 * - req.user is injected by auth middleware and typed globally
 */

const promptResolverService = new PromptResolverService();

export class PromptController {
  /**
   * GET /api/ai/prompts/active
   * Fetch currently active prompts (role + language wise)
   */
  static async getActivePrompts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user || req.user.role !== "super-admin") {
        res.status(403).json({
          success: false,
          message: "Access denied",
        });
        return;
      }

      const snapshot =
        promptResolverService.getActivePromptSnapshot();

      res.status(200).json({
        success: true,
        data: snapshot,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/ai/prompts/preview
   * Preview how a prompt will be resolved for a role
   * (NO DB write, NO AI execution)
   */
  static async previewPrompt(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user || req.user.role !== "super-admin") {
        res.status(403).json({
          success: false,
          message: "Access denied",
        });
        return;
      }

      const {
        role,
        language,
        message,
      } = req.body as {
        role:
          | "patient"
          | "doctor"
          | "hospital-admin"
          | "super-admin"
          | "hospital";
        language?: "en" | "hi";
        message: string;
      };

      if (!role || !message) {
        res.status(400).json({
          success: false,
          message: "role and message are required",
        });
        return;
      }

      const resolved =
        promptResolverService.resolve({
          role,
          language: language ?? "en",
          userMessage: message,
          context: {
            preview: true,
          },
        });

      res.status(200).json({
        success: true,
        data: {
          finalPrompt: resolved.finalPrompt,
          meta: resolved.meta,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/ai/prompts/update
   * Update prompt content for a role & language
   * (Versioning & DB persistence will be added later)
   */
  static async updatePrompt(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user || req.user.role !== "super-admin") {
        res.status(403).json({
          success: false,
          message: "Access denied",
        });
        return;
      }

      const {
        role,
        language,
        content,
      } = req.body as {
        role:
          | "patient"
          | "doctor"
          | "hospital-admin"
          | "super-admin"
          | "hospital";
        language?: "en" | "hi";
        content: string;
      };

      if (!role || !content) {
        res.status(400).json({
          success: false,
          message: "role and content are required",
        });
        return;
      }

      promptResolverService.updatePrompt({
        role,
        language: language ?? "en",
        content,
        updatedBy: req.user.id,
      });

      res.status(200).json({
        success: true,
        message: "Prompt updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
