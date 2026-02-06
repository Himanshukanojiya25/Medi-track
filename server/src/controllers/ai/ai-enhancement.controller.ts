import { Request, Response } from "express";
import { AISuggestionModel } from "../../models/ai/suggestion";
import { AIEnhancementResolverService } from "../../services/ai/ai-enhancement-resolver.service";
import {
  AIEnhancementMode,
  AIEnhancementLanguage,
} from "../../types/ai/ai-enhancement.types";

/**
 * =====================================================
 * AI ENHANCEMENT CONTROLLER
 * =====================================================
 * Phase: 3.3 (AI Enhancement)
 *
 * Read-only, fail-safe, enterprise-grade
 */
export class AIEnhancementController {
  /**
   * ===================================================
   * LIST ENHANCED AI SUGGESTIONS
   * ===================================================
   * GET /api/v1/ai/suggestions/enhanced
   */
  static async listEnhanced(
    req: Request,
    res: Response
  ) {
    const user = (req as any).user;

    if (!user || !user.role || !user.hospitalId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /**
     * -----------------------------------------------
     * Normalize query params (STRICT + TYPE SAFE)
     * -----------------------------------------------
     */
    const modes: AIEnhancementMode[] | undefined =
      typeof req.query.modes === "string"
        ? (req.query.modes
            .split(",")
            .filter(Boolean) as AIEnhancementMode[])
        : undefined;

    const language: AIEnhancementLanguage | undefined =
      typeof req.query.language === "string"
        ? (req.query.language as AIEnhancementLanguage)
        : undefined;

    /**
     * -----------------------------------------------
     * Fetch suggestions (READ-ONLY)
     * -----------------------------------------------
     */
    const suggestions = await AISuggestionModel.find({
      hospitalId: user.hospitalId,
      targetRole: user.role,
    })
      .sort({ createdAt: -1 })
      .lean();

    /**
     * -----------------------------------------------
     * Enhance suggestions (parallel + fail-safe)
     * -----------------------------------------------
     */
    const enhancedSuggestions = await Promise.all(
      suggestions.map(async (suggestion: any) => {
        try {
          const enhancement =
            await AIEnhancementResolverService.resolve({
              suggestionId: String(suggestion._id),
              suggestionCode: suggestion.code,
              originalMessage: suggestion.message,
              targetRole: suggestion.targetRole,
              modes: modes ?? [], // ✅ FINAL FIX (NO undefined)
              language,
              metadata: suggestion.metadata,
            });

          if (!enhancement.success || !enhancement.data) {
            return suggestion;
          }

          return {
            ...suggestion,
            enhancement: enhancement.data,
          };
        } catch {
          return suggestion;
        }
      })
    );

    /**
     * -----------------------------------------------
     * Response
     * -----------------------------------------------
     */
    return res.status(200).json({
      success: true,
      data: enhancedSuggestions,
    });
  }
}
