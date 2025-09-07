import { Router } from "express";
import { authCallback } from './../controllers/auth.controller.ts';

const router = Router();

router.post("/callback", authCallback);

export default router;
