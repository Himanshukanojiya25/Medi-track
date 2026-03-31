import { Router } from "express";
import { PublicAIController } from "../../controllers/public";

const router = Router();

router.post("/symptom/analyze", PublicAIController.analyzeSymptoms);

export default router;