import { Router } from "express";
import courseController from "./course.controller";
import authMiddleware, { silentAuthMiddleware } from "@/internal/middleware/auth";
import roleMiddleware from "@/internal/middleware/role";
import { uploadCourseThumbnail } from "@/internal/middleware/upload";

const router = Router();

// Public routes
router.get("/", silentAuthMiddleware, courseController.getCourses);
router.get("/my", authMiddleware, roleMiddleware(["user"]), courseController.getMyCourses);
router.get("/:id", silentAuthMiddleware, courseController.getCourseById);

// Admin routes
router.post("/", authMiddleware, roleMiddleware(["admin"]), uploadCourseThumbnail, courseController.createCourse);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), uploadCourseThumbnail, courseController.updateCourse);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), courseController.updateCourse);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), courseController.deleteCourse);

export default router;
