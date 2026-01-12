import { Router } from "express";
import HospitalAdminController from "../../controllers/hospital-admin/hospital-admin.controller";

const router = Router();

/**
 * Hospital Admin Routes
 */
router.post("/", HospitalAdminController.create);
router.get("/", HospitalAdminController.getAll);
router.get("/:id", HospitalAdminController.getById);
router.put("/:id", HospitalAdminController.updateById);
router.delete("/:id", HospitalAdminController.deleteById);

export default router;
