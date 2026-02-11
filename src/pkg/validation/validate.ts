// utils/validate.ts

import { AnySchema, InferType } from "yup";

export async function validateSchema<T extends AnySchema>(
   schema: T,
   data: any,
): Promise<InferType<T>> {
   return schema.validate(data, {
      abortEarly: false,
      stripUnknown: true, // remove field tidak dikenal
   });
}
