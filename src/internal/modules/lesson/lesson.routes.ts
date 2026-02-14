import { Router } from "express";
import lessonController from "./lesson.controller";
import authMiddleware, { silentAuthMiddleware } from "@/internal/middleware/auth";
import roleMiddleware from "@/internal/middleware/role";

const router = Router();

// Public/User routes
router.get("/", silentAuthMiddleware, lessonController.getLessons);
router.get("/:id", silentAuthMiddleware, lessonController.getLessonById);

// Admin routes
router.post("/", authMiddleware, roleMiddleware(["admin"]), lessonController.createLesson);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), lessonController.updateLesson);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), lessonController.deleteLesson);

export default router;
