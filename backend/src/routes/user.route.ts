import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.ts";
import { getAllMessages, getAllUsers } from "../controllers/user.controller.ts";

const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/messages/:userId", protectRoute, getAllMessages);

export default router;
