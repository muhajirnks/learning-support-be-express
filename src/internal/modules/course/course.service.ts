import { CourseSchema } from "@/internal/models/course";
import courseRepo from "./course.repo";
import { CreateCourseRequest, ListCourseRequest, UpdateCourseRequest } from "./course.validation";
import { NewNotFoundError } from "@/pkg/apperror/appError";
import mongoose from "mongoose";
import { uploadFile } from "@/pkg/cloudinary/cloudinary";

class CourseService {
   async getCourses(query: ListCourseRequest) {
      return await courseRepo.findAll(query);
   }

   async getCourseById(id: string) {
      const course = await courseRepo.findById(id);
      if (!course) throw NewNotFoundError("Course not found");
      return course;
   }

   async createCourse(data: CreateCourseRequest) {
      const course: Partial<CourseSchema> = {
         title: data.title,
         category: new mongoose.Types.ObjectId(data.category),
         description: data.description,
         price: data.price,
         instructor: data.instructor,
      };

      if (data.thumbnail) {
         const { publicPath } = await uploadFile(data.thumbnail, "products");
         course.thumbnailUrl = publicPath;
      }

      return await courseRepo.create(course);
   }

   async updateCourse(id: string, data: UpdateCourseRequest) {
      const course: Partial<CourseSchema> = {
         title: data.title,
         category: new mongoose.Types.ObjectId(data.category),
         description: data.description,
         price: data.price,
         instructor: data.instructor,
      };

      if (data.thumbnail) {
         const { publicPath } = await uploadFile(data.thumbnail, "products");
         course.thumbnailUrl = publicPath;
      }

      const updatedCourse = await courseRepo.update(id, course);
      if (!updatedCourse) throw NewNotFoundError("Course not found");
      return updatedCourse;
   }

   async deleteCourse(id: string) {
      const course = await courseRepo.delete(id);
      if (!course) throw NewNotFoundError("Course not found")
      return course;
   }
}

export default new CourseService();
