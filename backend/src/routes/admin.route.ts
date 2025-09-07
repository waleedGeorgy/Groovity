import { Router } from "express";
import {
  createAlbum,
  createSong,
  deleteAlbum,
  deleteSong,
  getAdminStatus,
} from "../controllers/admin.controller.ts";
import { checkAdmin, protectRoute } from "../middleware/auth.middleware.ts";

const router = Router();

router.use(protectRoute, checkAdmin);

router.get("/check-admin", getAdminStatus);
router.post("/songs", createSong);
router.delete("/songs/:songID", deleteSong);
router.post("/albums", createAlbum);
router.delete("/albums/:albumID", deleteAlbum);

export default router;
