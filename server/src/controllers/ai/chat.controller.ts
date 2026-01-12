// src/controllers/ai/chat.controller.ts

import { Request, Response, NextFunction } from "express";
import {
  ChatSessionService,
  ChatOrchestratorService,
} from "../../services/ai";
import { mapRoleToAIRole } from "../../utils/ai";

/**
 * NOTE:
 * req.user is injected by auth middleware
 * and typed via src/types/express/index.d.ts
 */

const sessionService = new ChatSessionService();
const orchestratorService = new ChatOrchestratorService();

export class ChatController {
  /**
   * POST /api/ai/chat/start
   */
  static async startChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const { id: userId, role, hospitalId } = req.user;

      // ✅ IMPORTANT: map role here
      const aiRole = mapRoleToAIRole(role);

      const session = await sessionService.startSession({
        role: aiRole,
        userId,
        hospitalId,
      });

      res.status(201).json({
        success: true,
        data: session,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/ai/chat/:sessionId/message
   */
  static async sendMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const { id: userId, role, hospitalId } = req.user;
      const { sessionId } = req.params;
      const { message, language } = req.body as {
        message?: string;
        language?: "en" | "hi";
      };

      if (!message) {
        res.status(400).json({
          success: false,
          message: "Message is required",
        });
        return;
      }

      // ✅ IMPORTANT: map role here too
      const aiRole = mapRoleToAIRole(role);

      const response = await orchestratorService.handleMessage({
        sessionId,
        userId,
        role: aiRole,
        message,
        language: language ?? "en",
        hospitalId,
      });

      res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/ai/chat/:sessionId/close
   */
  static async closeChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const { id: userId } = req.user;
      const { sessionId } = req.params;

      await sessionService.closeSession(sessionId, userId);

      res.status(200).json({
        success: true,
        message: "Chat session closed successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
