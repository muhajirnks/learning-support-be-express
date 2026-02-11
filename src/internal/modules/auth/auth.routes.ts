import { Router } from "express";
import {
   getProfileHandler,
   loginHandler,
   logoutHandler,
   refreshHandler,
   registerHandler,
} from "./auth.controller";
import authMiddleware from "@/internal/middleware/auth";

const router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/refresh", refreshHandler);
router.get("/profile", authMiddleware, getProfileHandler);
router.post("/logout", logoutHandler);

export default router;
