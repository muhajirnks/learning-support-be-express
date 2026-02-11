import Course, { CourseSchema } from "@/internal/models/course";
import { QueryFilter, UpdateQuery } from "mongoose";
import { ListCourseRequest } from "./course.validation";

class CourseRepo {
   async findAll(query: ListCourseRequest) {
      const filter: QueryFilter<CourseSchema> = {};

      if (query.search) {
         filter.$or = [
            { title: { $regex: query.search, $options: "i" } },
            { instructor: { $regex: query.search, $options: "i" } },
         ];
      }

      if (query.category) {
         filter.category = query.category;
      }

      if (query.minPrice || query.maxPrice) {
         const priceFilter: any = {};
         if (query.minPrice) priceFilter.$gte = query.minPrice;
         if (query.maxPrice) priceFilter.$lte = query.maxPrice;
         filter.price = priceFilter;
      }

      return await Course.paginate(
         filter,
         {
            page: query.page,
            limit: query.limit,
            sort: [
               [query.sort, query.direction],
               ["_id", "desc"],
            ],
            lean: true,
            populate: "category",
         },
      );
   }

   async findById(id: string) {
      return await Course.findById(id).populate("category");
   }

   async create(data: Partial<CourseSchema>) {
      return await Course.create(data);
   }

   async update(id: string, data: UpdateQuery<CourseSchema>) {
      return await Course.findByIdAndUpdate(id, data, { new: true });
   }

   async delete(id: string) {
      return await Course.findByIdAndDelete(id);
   }
}

export default new CourseRepo();
