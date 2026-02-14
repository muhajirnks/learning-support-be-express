import * as yup from "yup";

export const listLessonSchema = yup.object({
   page: yup.number().optional().min(1).default(1),
   limit: yup.number().optional().min(1).max(100).default(10),
   course: yup.string().required("Course is required"),
   search: yup.string().optional(),
   sort: yup
      .string()
      .optional()
      .oneOf(["_id", "title", "order", "createdAt", "updatedAt"])
      .default("_id"),
   direction: yup.string().oneOf(["asc", "desc"]).optional().default("desc"),
});

export const createLessonSchema = yup.object({
   course: yup.string().required("Course is required"),
   title: yup.string().required("Title is required"),
   content: yup.string().required("Content is required"),
   order: yup.number().required("Order is required").min(0),
});

export const updateLessonSchema = yup.object({
   title: yup.string().optional(),
   content: yup.string().optional(),
   order: yup.number().optional().min(0),
});

export type ListLessonRequest = yup.InferType<typeof listLessonSchema>;
export type CreateLessonRequest = yup.InferType<typeof createLessonSchema>;
export type UpdateLessonRequest = yup.InferType<typeof updateLessonSchema>;
