import { TransactionSchema } from "@/internal/models/transaction";
import transactionRepo from "./transaction.repo";
import {
   CreateTransactionRequest,
   ListTransactionRequest,
   UpdateTransactionStatusRequest,
} from "./transaction.validation";
import { NewNotFoundError, NewBadRequestError } from "@/pkg/apperror/appError";
import mongoose from "mongoose";

class TransactionService {
   async getTransactions(query: ListTransactionRequest) {
      return await transactionRepo.findAll(query);
   }

   async getTransactionById(id: string) {
      const transaction = await transactionRepo.findById(id);
      if (!transaction) throw NewNotFoundError("Transaction not found");
      return transaction;
   }

   async createTransaction(
      userId: string,
      data: CreateTransactionRequest,
   ) {
      const transaction: Partial<TransactionSchema> = {
         user: new mongoose.Types.ObjectId(userId),
         course: new mongoose.Types.ObjectId(data.course),
         amount: data.amount,
         paymentMethod: data.paymentMethod,
         status: "pending",
      };

      return await transactionRepo.create(transaction);
   }

   async updateTransactionStatus(
      id: string,
      data: UpdateTransactionStatusRequest,
   ) {
      const updatedTransaction = await transactionRepo.update(id, {
         status: data.status,
      });
      if (!updatedTransaction) throw NewNotFoundError("Transaction not found");
      return updatedTransaction;
   }

   async getMyTransactions(userId: string, query: ListTransactionRequest) {
      return await transactionRepo.findAll({ ...query, search: userId }); // Custom filter in repo would be better
   }

   async checkTransaction(userId: string, courseId: string) {
      return await transactionRepo.findOne({
         user: new mongoose.Types.ObjectId(userId),
         course: new mongoose.Types.ObjectId(courseId),
      });
   }
}

export default new TransactionService();
