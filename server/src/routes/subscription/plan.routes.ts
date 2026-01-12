import { Router } from "express";
import { PlanController } from "../../controllers/subscription/plan.controller";
import { validate } from "../../middlewares";
import { updatePlanSchema } from "../../validations/subscription/plan.validation";

const router = Router();

router.get("/", PlanController.getPlan);
router.put("/", validate(updatePlanSchema), PlanController.updatePlan);

export default router;
