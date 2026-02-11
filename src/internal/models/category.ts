import { Schema, Types, model } from "mongoose";
import { PaginateModel } from "@/pkg/pagination/mongoosePlugin";

export interface CategorySchema {
   _id: Types.ObjectId;
   name: string;
   description?: string;
   updatedAt: NativeDate;
   createdAt: NativeDate;
}

const categorySchema = new Schema<CategorySchema>(
   {
      name: {
         type: String,
         required: true,
         unique: true,
         trim: true,
      },
      description: {
         type: String,
      },
   },
   { timestamps: true, versionKey: false },
);

const Category = model<CategorySchema, PaginateModel<CategorySchema>>(
   "Category",
   categorySchema,
);

export default Category;
