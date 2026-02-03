import { Router } from "express";

import aiRoutes from "./ai.routes";
import chatbotRoutes from "./chatbot.routes";
import aiUsageRoutes from "./ai-usage.routes";
import aiSuggestionRoutes from "./ai-suggestion.routes";

const router = Router();

router.use("/", aiRoutes);
router.use("/chatbot", chatbotRoutes);
router.use("/usage", aiUsageRoutes);
router.use("/suggestions", aiSuggestionRoutes);

export default router;
