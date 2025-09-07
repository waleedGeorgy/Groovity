import { Router } from "express";
import { getAlbumByID, getAllAlbums } from "../controllers/album.controller.ts";

const router = Router();

router.get("/", getAllAlbums);
router.get("/:albumID", getAlbumByID);

export default router;
