import UserProgress from "@/internal/models/userProgress";

class ProgressRepo {
   async findOne(userId: string, lessonId: string) {
      return await UserProgress.findOne({ userId, lessonId });
   }

   async upsert(userId: string, courseId: string, lessonId: string, isCompleted: boolean) {
      return await UserProgress.findOneAndUpdate(
         { userId, lessonId },
         {
            userId,
            courseId,
            lessonId,
            isCompleted,
            completedAt: isCompleted ? new Date() : undefined,
         },
         { upsert: true, new: true }
      );
   }

   async findUserProgressInCourse(userId: string, courseId: string) {
      return await UserProgress.find({ userId, courseId });
   }
}

export default new ProgressRepo();
