import lessonRepo from "./lesson.repo";
import {
   CreateLessonRequest,
   ListLessonRequest,
   UpdateLessonRequest,
} from "./lesson.validation";
import { LessonSchema } from "@/internal/models/lesson";
import { NewNotFoundError } from "@/pkg/apperror/appError";
import mongoose from "mongoose";
import progressRepo from "../progress/progress.repo";

class LessonService {
   async getLessons(query: ListLessonRequest, userId?: string) {
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

   async getLessonById(id: string, userId?: string) {
      const lesson = await lessonRepo.findById(id);
      if (!lesson) throw NewNotFoundError("Lesson not found");

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
