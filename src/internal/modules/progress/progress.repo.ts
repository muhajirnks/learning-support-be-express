import UserProgress from "@/internal/models/userProgress";

class ProgressRepo {
   async findOne(userId: string, lessonId: string) {
      return await UserProgress.findOne({ user: userId, lesson: lessonId });
   }

   async upsert(userId: string, courseId: string, lessonId: string, isCompleted: boolean) {
      return await UserProgress.findOneAndUpdate(
         { user: userId, lesson: lessonId },
         {
            user: userId,
            course: courseId,
            lesson: lessonId,
            isCompleted,
            completedAt: isCompleted ? new Date() : undefined,
         },
         { upsert: true, returnDocument: 'after' }
      );
   }

   async findUserProgressInCourse(userId: string, courseId: string) {
      return await UserProgress.find({ user: userId, course: courseId });
   }

   async findUserProgressInCourses(userId: string, courseIds: string[]) {
      return await UserProgress.find({ user: userId, course: { $in: courseIds } });
   }
}

export default new ProgressRepo();
