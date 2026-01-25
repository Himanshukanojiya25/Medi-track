import { Request, Response, NextFunction } from "express";
import ChatbotService from "../../services/ai/chatbot.service";
import { Role } from "../../constants/roles";

/**
 * Chatbot Controller
 * ------------------
 * HTTP layer only.
 * Delegates logic to ChatbotService.
 */

/**
 * Expected request body for chatbot
 * (Controller-level contract)
 */
interface ChatbotRequestBody {
  role: Role;
  intent:
    | "GREETING"
    | "FAQ"
    | "APPOINTMENT_QUERY"
    | "PRESCRIPTION_QUERY"
    | "BILLING_QUERY"
    | "PROFILE_QUERY"
    | "UNKNOWN";
  userId: string;
  hospitalId?: string;
  payload?: unknown; // ✅ optional & safe
}

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
      } = req.body as ChatbotRequestBody;

      const result = await ChatbotService.handleQuery({
        role,
        intent,
        userId,
        hospitalId,
        payload, // ✅ now allowed
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
