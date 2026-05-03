import { Router } from "express";
import { getAllMessages, getAllUsers } from "../controllers/user.controller.ts";
import { requireAuth } from "../middleware/auth.middleware.ts";

const router = Router();

router.get("/", requireAuth, getAllUsers);
router.get("/messages/:userId", requireAuth, getAllMessages);

export default router;
