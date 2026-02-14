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
   startDate: yup.string().datetime().optional(),
   endDate: yup.string().datetime().optional(),
   search: yup.string().optional(),
});

export const createTransactionSchema = yup.object({
   course: yup.string().required("Course is required"),
   paymentMethod: yup.string().required("Payment method is required"),
   paymentProof: yup.mixed<Express.Multer.File>().optional(),
});

export const updateTransactionStatusSchema = yup.object({
   status: yup.string().oneOf(["pending", "success", "failed"]).required("Status is required"),
});

export type ListTransactionRequest = yup.InferType<typeof listTransactionSchema>;
export type CreateTransactionRequest = yup.InferType<typeof createTransactionSchema>;
export type UpdateTransactionStatusRequest = yup.InferType<typeof updateTransactionStatusSchema>;
