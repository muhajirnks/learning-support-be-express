import progressRepo from "./progress.repo";
import lessonRepo from "../lesson/lesson.repo";
import { NewNotFoundError } from "@/pkg/apperror/appError";

class ProgressService {
   async markAsCompleted(userId: string, lessonId: string) {
      const lesson = await lessonRepo.findById(lessonId);
      if (!lesson) throw NewNotFoundError("Lesson not found");

      return await progressRepo.upsert(
         userId,
         lesson.course.toString(),
         lessonId,
         true
      );
   }

   async getCourseProgress(userId: string, courseId: string) {
      const allLessons = await lessonRepo.findByCourseId(courseId);
      const userProgress = await progressRepo.findUserProgressInCourse(userId, courseId);

      const completedLessonIds = new Set(
         userProgress.filter((p) => p.isCompleted).map((p) => p.lesson.toString())
      );

      const lessonsWithStatus = allLessons.map((lesson) => ({
         ...lesson.toObject(),
         isCompleted: completedLessonIds.has(lesson._id.toString()),
      }));

      const totalLessons = allLessons.length;
      const completedLessons = completedLessonIds.size;
      const percentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      return {
         courseId,
         percentage,
         totalLessons,
         completedLessons,
         lessons: lessonsWithStatus,
      };
   }
}

export default new ProgressService();
