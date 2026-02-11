import Category, { CategorySchema } from "@/internal/models/category";
import { UpdateQuery } from "mongoose";
import { ListCategoryRequest } from "./category.validation";

class CategoryRepo {
   async findAll(query: ListCategoryRequest) {
      const filter = query.search
         ? { name: { $regex: query.search, $options: "i" } }
         : {};

      return await Category.paginate(filter, {
         page: query.page,
         limit: query.limit,
         sort: [
            [query.sort, query.direction],
            ["_id", "desc"],
         ],
         lean: true,
         populate: "category",
      });
   }

   async findById(id: string) {
      return await Category.findById(id);
   }

   async create(data: Partial<CategorySchema>) {
      return await Category.create(data);
   }

   async update(id: string, data: UpdateQuery<CategorySchema>) {
      return await Category.findByIdAndUpdate(id, data, { new: true });
   }

   async delete(id: string) {
      return await Category.findByIdAndDelete(id);
   }
}

export default new CategoryRepo();
