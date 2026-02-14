import { Request, Response } from "express";
import categoryService from "./category.service";
import {
   successResponse,
   createdResponse,
   paginationResponse,
} from "@/pkg/response/success";
import { validateSchema } from "@/pkg/validation/validate";
import {
   createCategorySchema,
   listCategorySchema,
   updateCategorySchema,
} from "./category.validation";

class CategoryController {
   async getCategories(req: Request, res: Response) {
      const query = await validateSchema(listCategorySchema, req.query);
      const result = await categoryService.getCategories(query);
      paginationResponse(res, result);
   }

   async getCategoryById(req: Request, res: Response) {
      const result = await categoryService.getCategoryById(
         req.params.id as string,
      );
      successResponse(res, {
         message: "Category retrieved successfully",
         data: result,
      });
   }

   async createCategory(req: Request, res: Response) {
      const body = await validateSchema(createCategorySchema, req.body);
      const result = await categoryService.createCategory(body);
      createdResponse(res, {
         message: "Category created successfully",
         data: result,
      });
   }

   async updateCategory(req: Request, res: Response) {
      const body = await validateSchema(updateCategorySchema, req.body);
      const result = await categoryService.updateCategory(
         req.params.id as string,
         body,
      );
      successResponse(res, {
         message: "Category updated successfully",
         data: result,
      });
   }

   async deleteCategory(req: Request, res: Response) {
      await categoryService.deleteCategory(req.params.id as string);
      successResponse(res, {
         message: "Category deleted successfully",
      });
   }
}

export default new CategoryController();
