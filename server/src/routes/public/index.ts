import { Router } from "express";
import doctorRoutes from "./doctor.routes";
import hospitalRoutes from "./hospital.routes";
import searchRoutes from "./search.routes";
import aiRoutes from "./ai.routes";

const router = Router();

router.use("/doctors", doctorRoutes);
router.use("/hospitals", hospitalRoutes);
router.use("/search", searchRoutes);
router.use("/ai", aiRoutes);

export default router;