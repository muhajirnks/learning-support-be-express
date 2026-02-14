import { CourseSchema } from "@/internal/models/course";
import courseRepo from "./course.repo";
import { CreateCourseRequest, ListCourseRequest, UpdateCourseRequest } from "./course.validation";
import { NewNotFoundError } from "@/pkg/apperror/appError";
import mongoose from "mongoose";
import { uploadFile } from "@/pkg/cloudinary/cloudinary";
import progressRepo from "../progress/progress.repo";

class CourseService {
   async getCourses(query: ListCourseRequest, userId?: string) {
      const result = await courseRepo.findAll(query);
      
      if (userId) {
         // Check purchased status for each course (mocked as true for now)
         result.data = result.data.map((course) => ({
            ...course,
            isPurchased: true, 
         }));
      }

      return result;
   }

   async getCourseById(id: string, userId?: string) {
      const course = await courseRepo.findById(id);
      if (!course) throw NewNotFoundError("Course not found");

      const courseObj = course.toObject();
      
      if (userId) {
         // Mocked as true for now
         (courseObj as any).isPurchased = true;
         
         // Get progress
         const userProgress = await progressRepo.findUserProgressInCourse(userId, id);
         const completedCount = userProgress.filter(p => p.isCompleted).length;
         (courseObj as any).completedLessonsCount = completedCount;
      }

      return courseObj;
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
         const { publicPath } = await uploadFile(data.thumbnail, "courses");
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
         const { publicPath } = await uploadFile(data.thumbnail, "courses");
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
