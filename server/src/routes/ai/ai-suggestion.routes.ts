import { Router } from "express";
import { AISuggestionController } from "../../controllers/ai/ai-suggestion.controller";
import authenticate from "../../middlewares/auth/authenticate.middleware";

const router = Router();

/**
 * ============================
 * AI SUGGESTION ROUTES
 * ============================
 * Base: /api/v1/ai/suggestions
 */

router.get(
  "/",
  authenticate,
  AISuggestionController.list
);

export default router;
