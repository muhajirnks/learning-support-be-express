import { config } from "dotenv";
config({ path: ".env" });

import { connectDB } from "@/internal/config/database";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";
import path from "path";
import initV1Route from "@/internal/routes/v1";
import globalErrorHandler from "@/internal/middleware/globalError";

const bootstrap = async () => {
   try {
      // 1. Database & External Services
      await connectDB();

      const app = express();
      const port = process.env.PORT || 3001;

      // 2. Middlewares
      const allowedOrigins = [
         "http://localhost:5173",
         "http://localhost:80",
         "http://localhost",
      ];
      app.use(
         cors({
            credentials: true,
            origin: (origin, callback) => {
               if (!origin || origin == process.env.BASE_URL || allowedOrigins.includes(origin)) {
                  callback(null, origin);
               } else {
                  callback(new Error("Not allowed by CORS"));
               }
            },
         }),
      );

      app.use(compression());
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(cookieParser());
      app.use(morgan("tiny"));

      // 3. Routes
      app.use("/api/v1", initV1Route());

      app.get("/health", (req, res) => {
         res.status(200).json({ status: "OK", message: "Server is running" });
      });

      // 4. FrontEnd / Static
      app.use(express.static(path.join(__dirname, "./public")));
      app.get("/*splat", (req, res) => {
         res.sendFile(path.join(__dirname, "./public/index.html"));
      });

      // 5. Global Error Handler
      app.use(globalErrorHandler);

      // 5. Start Server
      app.listen(port, () => {
         console.log(`Server running on [http://localhost:${port}]...`);
      });
   } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
   }
};

bootstrap();
