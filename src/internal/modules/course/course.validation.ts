import * as yup from "yup";

export const listCourseSchema = yup.object({
   page: yup.number().optional().min(1).default(1),
   limit: yup.number().optional().min(1).max(100).default(10),
   sort: yup
      .string()
      .optional()
      .oneOf([
         "_id",
         "title",
         "description",
         "instructor",
         "price",
         "createdAt",
         "updatedAt",
      ])
      .default("_id"),
   direction: yup.string().oneOf(["asc", "desc"]).optional().default("desc"),
   search: yup.string().optional(),
   category: yup.string().optional(),
   minPrice: yup.number().optional().min(0, "Min price must be at least 0"),
   maxPrice: yup
      .number()
      .optional()
      .min(0, "Max price must be at least 0")
      .test(
         "maxPrice-greater-than-minPrice",
         "Max price must be greater than min price",
         function (value) {
            const { minPrice } = this.parent;
            return Boolean(value) || !minPrice || value! > minPrice;
         },
      ),
});

export const createCourseSchema = yup.object({
   title: yup.string().required("Title is required"),
   description: yup.string().required("Description is required"),
   instructor: yup.string().required("Instructor is required"),
   price: yup
      .number()
      .required("Price is required")
      .min(0, "Price must be at least 0"),
   category: yup.string().required("Category ID is required"),
   thumbnail: yup.mixed<Express.Multer.File>().required("Thumbnail is required"),
});

export const updateCourseSchema = yup.object({
   title: yup.string().optional(),
   description: yup.string().optional(),
   instructor: yup.string().optional(),
   price: yup.number().min(0, "Price must be at least 0").optional(),
   category: yup.string().optional(),
   thumbnail: yup.mixed<Express.Multer.File>().optional(),
});

export type ListCourseRequest = yup.InferType<typeof listCourseSchema>;
export type CreateCourseRequest = yup.InferType<typeof createCourseSchema>;
export type UpdateCourseRequest = yup.InferType<typeof updateCourseSchema>;
