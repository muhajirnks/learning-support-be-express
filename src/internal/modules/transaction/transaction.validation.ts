import * as yup from "yup";

export const listTransactionSchema = yup.object({
   page: yup.number().optional().min(1).default(1),
   limit: yup.number().optional().min(1).max(100).default(10),
   sort: yup
      .string()
      .optional()
      .oneOf(["_id", "status", "amount", "createdAt", "updatedAt"])
      .default("createdAt"),
   direction: yup.string().oneOf(["asc", "desc"]).optional().default("desc"),
   status: yup.string().oneOf(["pending", "success", "failed"]).optional(),
   search: yup.string().optional(),
});

export type ListTransactionRequest = yup.InferType<typeof listTransactionSchema>;

export const createTransactionSchema = yup.object({
   course: yup.string().required("Course ID is required"),
   amount: yup.number().required("Amount is required").min(0, "Amount must be at least 0"),
   paymentMethod: yup.string().required("Payment method is required"),
   paymentProof: yup.mixed<Express.Multer.File>().optional(),
});

export type CreateTransactionRequest = yup.InferType<typeof createTransactionSchema>;

export const updateTransactionStatusSchema = yup.object({
   status: yup.string().oneOf(["pending", "success", "failed"]).required("Status is required"),
});

export type UpdateTransactionStatusRequest = yup.InferType<typeof updateTransactionStatusSchema>;
