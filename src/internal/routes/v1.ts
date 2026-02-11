import { Router } from "express";
import authRoutes from "@/internal/modules/auth/auth.routes";
import courseRoutes from "@/internal/modules/course/course.routes";
import categoryRoutes from "@/internal/modules/category/category.routes";

const initV1Route = () => {
   const router = Router();

   router.use("/auth", authRoutes);
   router.use("/courses", courseRoutes);
   router.use("/categories", categoryRoutes);

   return router;
};

export default initV1Route;