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
import lessonRepo from "../lesson/lesson.repo";
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
         (courseObj as any).completedLessons = completedCount;
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
      const result = await courseRepo.findAll({
         ...query,
         ids: courseIds,
      });

      // Optimization: Batch fetch lessons count and user progress to avoid N+1 query
      const currentCourseIds = result.data.map(c => c._id.toString());
      
      const [lessonsCounts, userProgressList] = await Promise.all([
         lessonRepo.countByCourseIds(currentCourseIds),
         progressRepo.findUserProgressInCourses(userId, currentCourseIds)
      ]);

      // Map lessons count for easy access
      const lessonsCountMap = lessonsCounts.reduce((acc, curr) => {
         acc[curr._id.toString()] = curr.count;
         return acc;
      }, {} as Record<string, number>);

      // Map completed lessons for each course
      const completedLessonsMap = userProgressList.reduce((acc, curr) => {
         if (curr.isCompleted) {
            const cId = curr.course.toString();
            acc[cId] = (acc[cId] || 0) + 1;
         }
         return acc;
      }, {} as Record<string, number>);

      // Add progress percentage for each course
      result.data = result.data.map((course) => {
         const courseId = course._id.toString();
         const totalLessons = lessonsCountMap[courseId] || 0;
         const completedLessons = completedLessonsMap[courseId] || 0;

         const progressPercentage = totalLessons > 0 
            ? Math.round((completedLessons / totalLessons) * 100) 
            : 0;

         return {
            ...course,
            progressPercentage,
            totalLessons,
            completedLessons
         };
      }) as any;

      return result;
   }

   async getUserStats(userId: string) {
      // Get all successful transactions
      const transactions = await transactionRepo.findMany({
         user: new mongoose.Types.ObjectId(userId),
         status: "success",
      });

      const courseIds = transactions.map((t) => t.course.toString());
      const totalCourses = courseIds.length;

      if (totalCourses === 0) {
         return {
            totalCourses: 0,
            completedCourses: 0,
            totalTransactions: transactions.length,
         };
      }

      // Batch fetch data to calculate progress
      const [lessonsCounts, userProgressList] = await Promise.all([
         lessonRepo.countByCourseIds(courseIds),
         progressRepo.findUserProgressInCourses(userId, courseIds)
      ]);

      const lessonsCountMap = lessonsCounts.reduce((acc, curr) => {
         acc[curr._id.toString()] = curr.count;
         return acc;
      }, {} as Record<string, number>);

      const completedLessonsMap = userProgressList.reduce((acc, curr) => {
         if (curr.isCompleted) {
            const cId = curr.course.toString();
            acc[cId] = (acc[cId] || 0) + 1;
         }
         return acc;
      }, {} as Record<string, number>);

      // Calculate how many courses are 100% completed
      let completedCourses = 0;
      courseIds.forEach(id => {
         const total = lessonsCountMap[id] || 0;
         const completed = completedLessonsMap[id] || 0;
         if (total > 0 && completed === total) {
            completedCourses++;
         }
      });

      return {
         totalCourses,
         completedCourses,
         totalTransactions: transactions.length,
      };
   }
}

export default new CourseService();
