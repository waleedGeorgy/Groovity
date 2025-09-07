import { Router } from "express";
import { checkAdmin, protectRoute } from "../middleware/auth.middleware.ts";
import { getAllStats } from "../controllers/stats.controller.ts";

const router = Router();

router.get("/", protectRoute, checkAdmin, getAllStats);

export default router;
