import { Router } from "express";
import transactionController from "./transaction.controller";
import authMiddleware from "@/internal/middleware/auth";
import roleMiddleware from "@/internal/middleware/role";

const router = Router();

// User routes
router.get("/my", authMiddleware, roleMiddleware(["user"]), transactionController.getMyTransactions);
router.get("/check/:courseId", authMiddleware, roleMiddleware(["user"]), transactionController.checkTransaction);
router.post("/", authMiddleware, roleMiddleware(["user"]), transactionController.createTransaction);

// Admin routes
router.get("/", authMiddleware, roleMiddleware(["admin"]), transactionController.getTransactions);
router.get("/:id", authMiddleware, roleMiddleware(["admin"]), transactionController.getTransactionById);
router.patch("/:id/status", authMiddleware, roleMiddleware(["admin"]), transactionController.updateTransactionStatus);

export default router;
