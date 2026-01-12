import { Router } from "express";
import SuperAdminController from "../../controllers/super-admin/super-admin.controller";

const router = Router();

/**
 * Super Admin Routes
 */
router.post("/", SuperAdminController.create);
router.get("/", SuperAdminController.getAll);
router.get("/:id", SuperAdminController.getById);
router.put("/:id", SuperAdminController.updateById);
router.delete("/:id", SuperAdminController.deleteById);

export default router;
