import { Schema, Types, model } from "mongoose";
import { PaginateModel } from "@/pkg/pagination/mongoosePlugin";

export type TransactionStatus = "pending" | "success" | "failed";

export interface TransactionSchema {
   _id: Types.ObjectId;
   user: Types.ObjectId;
   course: Types.ObjectId;
   amount: number;
   status: TransactionStatus;
   paymentMethod: string;
   updatedAt: NativeDate;
   createdAt: NativeDate;
}

const transactionSchema = new Schema<TransactionSchema>(
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
      amount: {
         type: Number,
         required: true,
      },
      status: {
         type: String,
         enum: ["pending", "success", "failed"],
         default: "pending",
      },
      paymentMethod: {
         type: String,
         required: true,
      },
   },
   { timestamps: true, versionKey: false }
);

const Transaction = model<TransactionSchema, PaginateModel<TransactionSchema>>(
   "Transaction",
   transactionSchema
);

export default Transaction;
