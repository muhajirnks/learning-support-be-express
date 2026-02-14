import { Schema, Types, model } from "mongoose";
import { PaginateModel } from "@/pkg/pagination/mongoosePlugin";

export interface LessonSchema {
   _id: Types.ObjectId;
   course: Types.ObjectId;
   title: string;
   content: string; // Bisa berupa teks, HTML, atau link video
   order: number;
   updatedAt: NativeDate;
   createdAt: NativeDate;
}

const lessonSchema = new Schema<LessonSchema>(
   {
      course: {
         type: Schema.Types.ObjectId,
         ref: "Course",
         required: true,
      },
      title: {
         type: String,
         required: true,
      },
      content: {
         type: String,
         required: true,
      },
      order: {
         type: Number,
         required: true,
         default: 0,
      },
   },
   { timestamps: true, versionKey: false }
);

const Lesson = model<LessonSchema, PaginateModel<LessonSchema>>("Lesson", lessonSchema);

export default Lesson;
