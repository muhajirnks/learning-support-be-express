import { Request, Response } from "express";
import courseService from "./course.service";
import { successResponse, createdResponse } from "@/pkg/response/success";
import { validateSchema } from "@/pkg/validation/validate";
import {
   createCourseSchema,
   listCourseSchema,
   updateCourseSchema,
} from "./course.validation";

class CourseController {
   async getCourses(req: Request, res: Response) {
      const query = await validateSchema(listCourseSchema, req.query);
      const result = await courseService.getCourses(query);
      successResponse(res, {
         message: "Courses retrieved successfully",
         data: result,
      });
   }

   async getCourseById(req: Request, res: Response) {
      const result = await courseService.getCourseById(req.params.id as string);
      successResponse(res, {
         message: "Course retrieved successfully",
         data: result,
      });
   }

   async createCourse(req: Request, res: Response) {
      req.body.thumbnail = req.file;
      const body = await validateSchema(createCourseSchema, req.body);
      const result = await courseService.createCourse(body);
      createdResponse(res, {
         message: "Course created successfully",
         data: result,
      });
   }

   async updateCourse(req: Request, res: Response) {
      req.body.thumbnail = req.file;
      const body = await validateSchema(updateCourseSchema, req.body);
      const result = await courseService.updateCourse(
         req.params.id as string,
         body,
      );
      successResponse(res, {
         message: "Course updated successfully",
         data: result,
      });
   }

   async deleteCourse(req: Request, res: Response) {
      await courseService.deleteCourse(req.params.id as string);
      successResponse(res, {
         message: "Course deleted successfully",
      });
   }
}

export default new CourseController();
