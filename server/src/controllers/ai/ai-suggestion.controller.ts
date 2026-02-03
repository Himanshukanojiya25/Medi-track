import { Request, Response } from "express";
import { AISuggestionModel } from "../../models/ai/suggestion";

export class AISuggestionController {
  /**
   * ============================
   * LIST AI SUGGESTIONS
   * ============================
   * Read-only
   * Role + hospital scoped
   */
  static async list(req: Request, res: Response) {
    const user = req.user;

    if (!user || !user.role || !user.hospitalId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const suggestions = await AISuggestionModel.find({
      hospitalId: user.hospitalId,
      targetRole: user.role, // 🔥 THIS WAS THE REAL BUG
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: suggestions,
    });
  }
}
