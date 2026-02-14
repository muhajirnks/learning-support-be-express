import { Request, Response } from "express";
import lessonService from "./lesson.service";
import { successResponse, createdResponse, paginationResponse } from "@/pkg/response/success";
import { validateSchema } from "@/pkg/validation/validate";
import {
   createLessonSchema,
   listLessonSchema,
   updateLessonSchema,
} from "./lesson.validation";

class LessonController {
   async getLessons(req: Request, res: Response) {
      const query = await validateSchema(listLessonSchema, req.query);
      const result = await lessonService.getLessons(query, req.user?.id, req.user?.role);
      paginationResponse(res, result);
   }

   async getLessonById(req: Request, res: Response) {
      const result = await lessonService.getLessonById(req.params.id as string, req.user?.id, req.user?.role);
      successResponse(res, {
         message: "Lesson retrieved successfully",
         data: result,
      });
   }

   async createLesson(req: Request, res: Response) {
      const body = await validateSchema(createLessonSchema, req.body);
      const result = await lessonService.createLesson(body);
      createdResponse(res, {
         message: "Lesson created successfully",
         data: result,
      });
   }

   async updateLesson(req: Request, res: Response) {
      const body = await validateSchema(updateLessonSchema, req.body);
      const result = await lessonService.updateLesson(
         req.params.id as string,
         body,
      );
      successResponse(res, {
         message: "Lesson updated successfully",
         data: result,
      });
   }

   async deleteLesson(req: Request, res: Response) {
      await lessonService.deleteLesson(req.params.id as string);
      successResponse(res, {
         message: "Lesson deleted successfully",
      });
   }
}

export default new LessonController();
