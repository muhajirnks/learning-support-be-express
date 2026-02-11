import { Schema, Types, model } from "mongoose";
import bcrypt from "bcrypt";
import { PaginateModel } from "@/pkg/pagination/mongoosePlugin";

export interface UserSchema {
   _id: Types.ObjectId;
   name: string;
   email: string;
   password?: string;
   role: "admin" | "user";
   updatedAt: NativeDate;
   createdAt: NativeDate;
}

const userSchema = new Schema<UserSchema>(
   {
      name: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         lowercase: true,
      },
      password: {
         type: String,
         required: true,
         minLength: 8,
         trim: true,
      },
      role: {
         type: String,
         enum: ["admin", "user"],
         default: "user",
      },
   },
   { timestamps: true, versionKey: false }
);

userSchema.pre("save", async function () {
   const salt = await bcrypt.genSalt(10);

   if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password!, salt);
   }
});

const User = model<UserSchema, PaginateModel<UserSchema>>("User", userSchema);

export default User;
