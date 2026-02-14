import Lesson, { LessonSchema } from "@/internal/models/lesson";
import { QueryFilter, UpdateQuery } from "mongoose";
import { ListLessonRequest } from "./lesson.validation";

class LessonRepo {
   async findAll(query: ListLessonRequest) {
      const filter: QueryFilter<LessonSchema> = {};

      if (query.search) {
         filter.title = { $regex: query.search, $options: "i" }
      }

      if (query.course) {
         filter.course = query.course;
      }

      return await Lesson.paginate(filter, {
         page: query.page,
         limit: query.limit,
         sort: [
            [query.sort, query.direction],
            ["_id", "desc"],
         ],
         lean: true,
      });
   }

   async findById(id: string) {
      return await Lesson.findById(id);
   }

   async create(data: Partial<LessonSchema>) {
      return await Lesson.create(data);
   }

   async update(id: string, data: UpdateQuery<LessonSchema>) {
      return await Lesson.findByIdAndUpdate(id, data, { new: true });
   }

   async delete(id: string) {
      return await Lesson.findByIdAndDelete(id);
   }

   async findByCourseId(courseId: string) {
      return await Lesson.find({ courseId }).sort({ order: 1 });
   }
}

export default new LessonRepo();
