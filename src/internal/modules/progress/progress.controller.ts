import { Request, Response } from "express";
import progressService from "./progress.service";
import { successResponse } from "@/pkg/response/success";

class ProgressController {
   async markAsCompleted(req: Request, res: Response) {
      const userId = req.user!.id;
      const { lessonId } = req.params;

      const result = await progressService.markAsCompleted(userId, lessonId as string);
      successResponse(res, {
         message: "Lesson marked as completed",
         data: result,
      });
   }

   async getCourseProgress(req: Request, res: Response) {
      const userId = req.user!.id;
      const { courseId } = req.params;

      const result = await progressService.getCourseProgress(userId, courseId as string);
      successResponse(res, {
         message: "Course progress retrieved successfully",
         data: result,
      });
   }
}

export default new ProgressController();
