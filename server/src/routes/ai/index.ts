// src/routes/ai/index.ts

import { Router } from "express";
import aiRoutes from "./ai.routes";

const router = Router();

/**
 * Mount all AI routes
 * Base path: /api/ai
 */
router.use("/", aiRoutes);

export default router;
