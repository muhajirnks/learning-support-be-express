import Transaction, { TransactionSchema } from "@/internal/models/transaction";
import { QueryFilter, UpdateQuery } from "mongoose";
import { ListTransactionRequest } from "./transaction.validation";

class TransactionRepo {
   async findAll(query: ListTransactionRequest) {
      const filter: QueryFilter<TransactionSchema> = {};

      if (query.status) {
         filter.status = query.status;
      }

      if (query.search) {
         const searchRegex = new RegExp(query.search, "i");
         const [users, courses] = await Promise.all([
            require("@/internal/models/user").default.find({ name: searchRegex }).select("_id"),
            require("@/internal/models/course").default.find({ title: searchRegex }).select("_id"),
         ]);

         filter.$or = [
            { user: { $in: users.map((u: any) => u._id) } },
            { course: { $in: courses.map((c: any) => c._id) } },
         ];
      }

      return await Transaction.paginate(filter, {
         page: query.page,
         limit: query.limit,
         sort: [[query.sort, query.direction]],
         lean: true,
         populate: ["user", "course"],
      });
   }

   async findById(id: string) {
      return await Transaction.findById(id).populate(["user", "course"]);
   }

   async create(data: Partial<TransactionSchema>) {
      return await Transaction.create(data);
   }

   async update(id: string, data: UpdateQuery<TransactionSchema>) {
      return await Transaction.findByIdAndUpdate(id, data, { new: true });
   }

   async findOne(filter: QueryFilter<TransactionSchema>) {
      return await Transaction.findOne(filter);
   }

   async findMany(filter: QueryFilter<TransactionSchema>) {
      return await Transaction.find(filter).lean();
   }
}

export default new TransactionRepo();
