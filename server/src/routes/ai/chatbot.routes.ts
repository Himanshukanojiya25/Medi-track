import { Router } from "express";
import ChatbotController from "../../controllers/ai/chatbot.controller";

const router = Router();

/**
 * Chatbot Routes
 * --------------
 * Base path: /chatbot
 *
 * This is a generic conversational endpoint.
 * Frontend / client decides role + intent.
 */
router.post("/", ChatbotController.handle);

export default router;
