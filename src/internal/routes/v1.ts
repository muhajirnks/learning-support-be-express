import { Router } from "express";
import authRoutes from "@/internal/modules/auth/auth.routes";
import courseRoutes from "@/internal/modules/course/course.routes";
import categoryRoutes from "@/internal/modules/category/category.routes";
import lessonRoutes from "@/internal/modules/lesson/lesson.routes";
import progressRoutes from "@/internal/modules/progress/progress.routes";
import transactionRoutes from "@/internal/modules/transaction/transaction.routes";

const initV1Route = () => {
   const router = Router();

   router.use("/auth", authRoutes);
   router.use("/courses", courseRoutes);
   router.use("/categories", categoryRoutes);
   router.use("/lessons", lessonRoutes);
   router.use("/progress", progressRoutes);
   router.use("/transactions", transactionRoutes);

   return router;
};

export default initV1Route;