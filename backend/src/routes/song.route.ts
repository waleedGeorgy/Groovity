import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.ts";
import {
  getAllSongs,
  getFeaturedSongs,
  getPersonalizedSongs,
  getTrendingSongs,
} from "../controllers/song.controller.ts";

const router = Router();

router.get("/", requireAuth, requireAdmin, getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/personalized", getPersonalizedSongs);
router.get("/trending", getTrendingSongs);

export default router;
