import { Router } from "express";
import {
  getAllSongs,
  getFeaturedSongs,
  getPersonalizedSongs,
  getTrendingSongs,
} from "../controllers/song.controller.ts";
import { checkAdmin, protectRoute } from "../middleware/auth.middleware.ts";

const router = Router();

router.get("/", protectRoute, checkAdmin, getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/personalized", getPersonalizedSongs);
router.get("/trending", getTrendingSongs);

export default router;
