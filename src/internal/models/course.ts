import { Schema, Types, model } from "mongoose";
import { PaginateModel } from "@/pkg/pagination/mongoosePlugin";

export interface CourseSchema {
   _id: Types.ObjectId;
   title: string;
   description: string;
   instructor: string;
   price: number;
   category: Types.ObjectId;
   thumbnailUrl?: string;
   updatedAt: NativeDate;
   createdAt: NativeDate;
}

const courseSchema = new Schema<CourseSchema>(
   {
      title: {
         type: String,
         required: true,
      },
      description: {
         type: String,
         required: true,
      },
      instructor: {
         type: String,
         required: true,
      },
      price: {
         type: Number,
         required: true,
         default: 0,
      },
      category: {
         type: Schema.Types.ObjectId,
         ref: "Category",
         required: true,
      },
      thumbnailUrl: {
         type: String,
      },
   },
   { timestamps: true, versionKey: false }
);

const Course = model<CourseSchema, PaginateModel<CourseSchema>>("Course", courseSchema);

export default Course;
