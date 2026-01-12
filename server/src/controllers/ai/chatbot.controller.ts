import { Request, Response, NextFunction } from "express";
import ChatbotService from "../../services/ai/chatbot.service";

/**
 * Chatbot Controller
 * ------------------
 * HTTP layer only.
 * Delegates logic to ChatbotService.
 */
export default class ChatbotController {
  /**
   * Handle chatbot query
   */
  static async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        role,
        intent,
        userId,
        hospitalId,
        payload,
      } = req.body;

      const result = await ChatbotService.handleQuery({
        role,
        intent,
        userId,
        hospitalId,
        payload,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
