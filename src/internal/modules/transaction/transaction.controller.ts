import { Request, Response } from "express";
import transactionService from "./transaction.service";
import { successResponse, createdResponse, paginationResponse } from "@/pkg/response/success";
import { validateSchema } from "@/pkg/validation/validate";
import {
   createTransactionSchema,
   listTransactionSchema,
   updateTransactionStatusSchema,
} from "./transaction.validation";

class TransactionController {
   async getTransactions(req: Request, res: Response) {
      const query = await validateSchema(listTransactionSchema, req.query);
      const result = await transactionService.getTransactions(query);
      paginationResponse(res, result);
   }

   async getTransactionById(req: Request, res: Response) {
      const result = await transactionService.getTransactionById(req.params.id as string);
      successResponse(res, {
         message: "Transaction retrieved successfully",
         data: result,
      });
   }

   async createTransaction(req: Request, res: Response) {
      const body = await validateSchema(createTransactionSchema, req.body);
      const result = await transactionService.createTransaction(req.user!.id, body);
      createdResponse(res, {
         message: "Transaction created successfully",
         data: result,
      });
   }

   async updateTransactionStatus(req: Request, res: Response) {
      const body = await validateSchema(updateTransactionStatusSchema, req.body);
      const result = await transactionService.updateTransactionStatus(
         req.params.id as string,
         body
      );
      successResponse(res, {
         message: "Transaction status updated successfully",
         data: result,
      });
   }

   async getMyTransactions(req: Request, res: Response) {
      const query = await validateSchema(listTransactionSchema, req.query);
      const result = await transactionService.getMyTransactions(req.user!.id, query);
      paginationResponse(res, result);
   }

   async checkTransaction(req: Request, res: Response) {
      const { courseId } = req.params;
      const result = await transactionService.checkTransaction(req.user!.id, courseId as string);
      successResponse(res, {
         message: "Transaction status checked",
         data: result,
      });
   }
}

export default new TransactionController();
