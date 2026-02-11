import { Schema, Model, QueryFilter } from "mongoose";
import { PaginationResult } from "./models";
import { PopulateOptions } from "mongoose";

type SortOrder = -1 | 1 | 'asc' | 'ascending' | 'desc' | 'descending';

export interface PaginateOptions<T> {
   page?: number;
   limit?: number;
   populate?: string | PopulateOptions | (string | PopulateOptions)[];
   select?: string | (keyof T)[] | Partial<Record<keyof T, 1 | 0 | boolean>>;
   sort?: string | [keyof T, SortOrder][] | Partial<Record<keyof T, SortOrder>>;
   lean?: boolean;
}

export interface PaginateModel<T> extends Model<T> {
   paginate(
      query?: QueryFilter<T>,
      options?: PaginateOptions<T>
   ): Promise<PaginationResult<T>>;
}

const paginationPlugin = (schema: Schema) => {
   schema.statics.paginate = async function <T>(
      this: Model<T>,
      query: QueryFilter<T> = {},
      options: PaginateOptions<T> = {}
   ): Promise<PaginationResult<T>> {
      const page = Math.max(1, options.page || 1);
      const limit = Math.max(1, options.limit || 10);
      const skip = (page - 1) * limit;

      let docQuery = this.find(query);

      if (options.select) docQuery = docQuery.select(options.select as any);
      if (options.sort) docQuery = docQuery.sort(options.sort as any);
      if (options.populate) docQuery = docQuery.populate(options.populate as any);

      const [docs, totalDocs] = await Promise.all([
         docQuery.skip(skip).limit(limit).lean(!!options.lean).exec(),
         this.countDocuments(query).exec(),
      ]);

      const totalPages = Math.ceil(totalDocs / limit);

      return {
         meta: {
            page: page,
            lastPage: totalPages,
            limit: limit,
            total: totalDocs,
         },
         data: docs as T[],
      };
   };
};

export default paginationPlugin;
