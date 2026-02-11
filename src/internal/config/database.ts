import paginationPlugin from "@/pkg/pagination/mongoosePlugin";
import mongoose from "mongoose";

// Apply the plugin globally to all schemas
mongoose.plugin(paginationPlugin);

export const connectDB = async () => {
   await mongoose.connect(process.env.DB_URL!);
   console.log("Database Connected");
};
