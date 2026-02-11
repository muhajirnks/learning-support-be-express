export interface PaginationQS {
   page?: string;
   limit?: string;
   sort?: string;
   direction?: "asc" | "desc";
   search?: string;
}

export interface PaginationMeta {
   total: number;
   limit: number;
   page: number;
   lastPage: number;
}

export interface PaginationResult<T> {
   meta: PaginationMeta;
   data: T[];
}
