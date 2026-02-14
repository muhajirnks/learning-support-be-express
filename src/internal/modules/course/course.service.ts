import { CourseSchema } from "@/internal/models/course";
import courseRepo from "./course.repo";
import {
   CreateCourseRequest,
   ListCourseRequest,
   UpdateCourseRequest,
} from "./course.validation";
import { NewNotFoundError } from "@/pkg/apperror/appError";
import mongoose from "mongoose";
import { uploadFile } from "@/pkg/cloudinary/cloudinary";
import progressRepo from "../progress/progress.repo";
import transactionRepo from "../transaction/transaction.repo";
import { PaginationResult } from "@/pkg/pagination/models";

class CourseService {
   async getCourses(query: ListCourseRequest, userId?: string) {
      const result = await courseRepo.findAll(query);

      if (userId) {
         // Check purchased status for each course
         const courseIds = result.data.map((c) => c._id);
         const transactions = await transactionRepo.findMany({
            user: new mongoose.Types.ObjectId(userId),
            course: { $in: courseIds },
         });

         result.data = result.data.map((course) => {
            let isPurchased = false;
            let transactionStatus = null;

            if (course.price == 0) {
               isPurchased = true;
               transactionStatus = "success";
            } else {
               const transaction = transactions.find(
                  (t) => t.course.toString() === course._id.toString(),
               );

               isPurchased = transaction?.status === "success";
               transactionStatus = transaction?.status;
            }
            return {
               ...course,
               isPurchased,
               transactionStatus,
            };
         });
      }

      return result;
   }

   async getCourseById(id: string, userId?: string) {
      const course = await courseRepo.findById(id);
      if (!course) throw NewNotFoundError("Course not found");

      const courseObj = course.toObject();

      if (userId) {
         const transaction = await transactionRepo.findOne({
            user: new mongoose.Types.ObjectId(userId),
            course: new mongoose.Types.ObjectId(id),
         });

         (courseObj as any).isPurchased = courseObj.price == 0 || transaction?.status === "success";
         (courseObj as any).transactionStatus = courseObj.price == 0 ? 'sucess' : transaction?.status;

         // Get progress
         const userProgress = await progressRepo.findUserProgressInCourse(
            userId,
            id,
         );
         const completedCount = userProgress.filter(
            (p) => p.isCompleted,
         ).length;
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
      if (!course) throw NewNotFoundError("Course not found");
      return course;
   }

   async getMyCourses(userId: string, query: ListCourseRequest) {
      // Find all successful transactions for this user
      const transactions = await transactionRepo.findMany({
         user: new mongoose.Types.ObjectId(userId),
         status: "success",
      });

      const courseIds = transactions.map((t) => t.course.toString());
      
      // If no courses purchased, return empty pagination
      if (courseIds.length === 0) {
         return {
            data: [],
            meta: {
               total: 0,
               page: query.page,
               limit: query.limit,
               lastPage: 1,
            },
         } as PaginationResult<CourseSchema>;
      }

      // Find courses by IDs
      return await courseRepo.findAll({
         ...query,
         ids: courseIds,
      });
   }
}

export default new CourseService();
