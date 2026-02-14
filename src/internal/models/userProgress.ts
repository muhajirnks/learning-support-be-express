import { PaginateModel } from "@/pkg/pagination/mongoosePlugin";
import { Schema, Types, model } from "mongoose";

export interface UserProgressSchema {
   _id: Types.ObjectId;
   user: Types.ObjectId;
   course: Types.ObjectId;
   lesson: Types.ObjectId;
   isCompleted: boolean;
   completedAt?: NativeDate;
   updatedAt: NativeDate;
   createdAt: NativeDate;
}

const userProgressSchema = new Schema<UserProgressSchema>(
   {
      user: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      course: {
         type: Schema.Types.ObjectId,
         ref: "Course",
         required: true,
      },
      lesson: {
         type: Schema.Types.ObjectId,
         ref: "Lesson",
         required: true,
      },
      isCompleted: {
         type: Boolean,
         default: false,
      },
      completedAt: {
         type: Date,
      },
   },
   { timestamps: true, versionKey: false },
);

// Satu user hanya bisa punya satu status progress per lesson
userProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

const UserProgress = model<
   UserProgressSchema,
   PaginateModel<UserProgressSchema>
>("UserProgress", userProgressSchema);

export default UserProgress;
