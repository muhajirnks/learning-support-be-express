import { Router } from "express";
import categoryController from "./category.controller";
import authMiddleware from "@/internal/middleware/auth";
import roleMiddleware from "@/internal/middleware/role";

const router = Router();

// Public routes
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

// Admin routes
router.post("/", authMiddleware, roleMiddleware(["admin"]), categoryController.createCategory);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), categoryController.updateCategory);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), categoryController.deleteCategory);

export default router;
