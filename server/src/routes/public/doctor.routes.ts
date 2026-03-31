import { Router } from "express";
import { PublicDoctorController } from "../../controllers/public";

const router = Router();

router.get("/", PublicDoctorController.getList);
router.get("/:id", PublicDoctorController.getById);
router.get("/:id/reviews", PublicDoctorController.getReviews);

export default router;