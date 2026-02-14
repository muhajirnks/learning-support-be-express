import { Router } from "express";
import progressController from "./progress.controller";
import authMiddleware from "@/internal/middleware/auth";

const router = Router();

router.post("/lesson/:lessonId/complete", authMiddleware, progressController.markAsCompleted);
router.get("/course/:courseId", authMiddleware, progressController.getCourseProgress);

export default router;
