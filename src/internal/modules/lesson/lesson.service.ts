import lessonRepo from "./lesson.repo";
import {
   CreateLessonRequest,
   ListLessonRequest,
   UpdateLessonRequest,
} from "./lesson.validation";
import { LessonSchema } from "@/internal/models/lesson";
import { NewNotFoundError, NewForbiddenError } from "@/pkg/apperror/appError";
import mongoose from "mongoose";
import progressRepo from "../progress/progress.repo";
import courseRepo from "../course/course.repo";
import transactionRepo from "../transaction/transaction.repo";

class LessonService {
   private async checkAccess(courseId: string, userId?: string, role?: string) {
      if (role === "admin") return true;

      const course = await courseRepo.findById(courseId);
      if (!course) throw NewNotFoundError("Course not found");

      // Jika kursus gratis (price 0), izinkan akses
      if (course.price === 0) return true;

      if (!userId || !role) return false;

      // Cek apakah user sudah membeli kursus (status success)
      const transaction = await transactionRepo.findOne({
         user: new mongoose.Types.ObjectId(userId),
         course: new mongoose.Types.ObjectId(courseId),
         status: "success",
      });

      if (!transaction) {
         throw NewForbiddenError("You have not purchased this course yet");
      }

      return true;
   }

   async getLessons(query: ListLessonRequest, userId?: string, role?: string) {
      await this.checkAccess(query.course, userId, role);

      const result = await lessonRepo.findAll(query);

      if (userId) {
         const userProgress = await progressRepo.findUserProgressInCourse(userId, query.course);
         const completedLessonIds = new Set(
            userProgress.filter((p) => p.isCompleted).map((p) => p.lesson.toString())
         );

         result.data = result.data.map((lesson) => ({
            ...lesson,
            isCompleted: completedLessonIds.has(lesson._id.toString()),
         }));
      }

      return result;
   }

   async getLessonById(id: string, userId?: string, role?: string) {
      const lesson = await lessonRepo.findById(id);
      if (!lesson) throw NewNotFoundError("Lesson not found");

      await this.checkAccess(lesson.course.toString(), userId, role);

      const lessonObj = lesson.toObject();

      if (userId) {
         const progress = await progressRepo.findOne(userId, id);
         (lessonObj as any).isCompleted = progress?.isCompleted || false;
      }

      return lessonObj;
   }

   async createLesson(data: CreateLessonRequest) {
      const lesson: Partial<LessonSchema> = {
         title: data.title,
         course: new mongoose.Types.ObjectId(data.course),
         content: data.content,
         order: data.order,
      };

      return await lessonRepo.create(lesson);
   }

   async updateLesson(id: string, data: UpdateLessonRequest) {
      const lesson: Partial<LessonSchema> = {
         title: data.title,
         content: data.content,
         order: data.order,
      };

      const updatedLesson = await lessonRepo.update(id, lesson);
      if (!updatedLesson) throw NewNotFoundError("Lesson not found");
      return updatedLesson;
   }

   async deleteLesson(id: string) {
      const lesson = await lessonRepo.delete(id);
      if (!lesson) throw NewNotFoundError("Lesson not found");
      return lesson;
   }
}

export default new LessonService();
