import categoryRepo from "./category.repo";
import { ListCategoryRequest } from "./category.validation";
import { CategorySchema } from "@/internal/models/category";
import { NewNotFoundError } from "@/pkg/apperror/appError";

class CategoryService {
   async getCategories(query: ListCategoryRequest) {
      return await categoryRepo.findAll(query);
   }

   async getCategoryById(id: string) {
      const category = await categoryRepo.findById(id);
      if (!category) throw NewNotFoundError("Category not found");
      return category;
   }

   async createCategory(data: Partial<CategorySchema>) {
      return await categoryRepo.create(data);
   }

   async updateCategory(id: string, data: Partial<CategorySchema>) {
      const category = await categoryRepo.update(id, data);
      if (!category) throw NewNotFoundError("Category not found");
      return category;
   }

   async deleteCategory(id: string) {
      const category = await categoryRepo.delete(id);
      if (!category) throw NewNotFoundError("Category not found");
      return category;
   }
}

export default new CategoryService();
