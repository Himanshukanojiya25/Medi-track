import { Router } from "express";
import { ChatController, PromptController } from "../../controllers/ai";

import authenticate from "../../middlewares/auth/authenticate.middleware";
import { authorize } from "../../middlewares/auth/authorize.middleware";
import hospitalContext from "../../middlewares/hospital/hospital-context.middleware";
import { devAuth } from "../../middlewares";

import validateRequest from "../../middlewares/request/validate-request.middleware";

import {
  startChatSchema,
  sendMessageSchema,
  closeChatSchema,
  previewPromptSchema,
  updatePromptSchema,
} from "../../validations/ai";

const router = Router();
const isDev = process.env.NODE_ENV !== "production";

/**
 * =====================================================
 * AI CHAT ROUTES
 * =====================================================
 */

const chatAuthChain = isDev
  ? [devAuth]
  : [
      authenticate,
      authorize(
        "patient",
        "doctor",
        "hospital-admin",
        "hospital",
        "super-admin"
      ),
      hospitalContext,
    ];

router.post(
  "/chat/start",
  ...chatAuthChain,
  validateRequest(startChatSchema),
  ChatController.startChat
);

router.post(
  "/chat/:sessionId/message",
  ...chatAuthChain,
  validateRequest(sendMessageSchema),
  ChatController.sendMessage
);

router.post(
  "/chat/:sessionId/close",
  ...chatAuthChain,
  validateRequest(closeChatSchema),
  ChatController.closeChat
);

/**
 * =====================================================
 * AI PROMPT GOVERNANCE (SUPER ADMIN ONLY)
 * =====================================================
 */

router.get(
  "/prompts/active",
  authenticate,
  authorize("super-admin"),
  PromptController.getActivePrompts
);

router.post(
  "/prompts/preview",
  authenticate,
  authorize("super-admin"),
  validateRequest(previewPromptSchema),
  PromptController.previewPrompt
);

router.post(
  "/prompts/update",
  authenticate,
  authorize("super-admin"),
  validateRequest(updatePromptSchema),
  PromptController.updatePrompt
);

export default router;
