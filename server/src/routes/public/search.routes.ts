import { Router } from "express";
import { PublicSearchController } from "../../controllers/public";

const router = Router();

router.get("/", PublicSearchController.search);

export default router;