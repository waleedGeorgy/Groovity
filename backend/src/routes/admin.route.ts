import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.ts";
import {
  createAlbum,
  createSong,
  deleteAlbum,
  deleteSong,
  getAdminStatus,
  getStats,
} from "../controllers/admin.controller.ts";

const router = Router();

router.get("/check-admin", requireAuth, getAdminStatus);
router.post("/songs", requireAuth, requireAdmin, createSong);
router.delete("/songs/:songID", requireAuth, requireAdmin, deleteSong);
router.post("/albums", requireAuth, requireAdmin, createAlbum);
router.delete("/albums/:albumID", requireAuth, requireAdmin, deleteAlbum);
router.get("/stats", requireAuth, requireAdmin, getStats);

export default router;
