export class AppError extends Error {
   public statusCode: number;
   public errorValue?: Error

   constructor(message: string, statusCode: number, err?: Error) {
      super(message);
      this.statusCode = statusCode;
      this.errorValue = err
   }
}

export const NewBadRequestError = (msg: string, err?: Error): AppError => {
   return new AppError(msg, 400, err);
}

export const NewUnauthorizedError = (msg: string, err?: Error): AppError => {
   return new AppError(msg, 401, err);
}

export const NewForbiddenError = (msg: string, err?: Error): AppError => {
   return new AppError(msg, 403, err);
}

export const NewNotFoundError = (msg: string, err?: Error): AppError => {
   return new AppError(msg, 404, err);
}

export const NewConflictError = (msg: string, err?: Error): AppError => {
   return new AppError(msg, 409, err);
}

export const NewInternalError = (msg: string, err: Error): AppError => {
   return new AppError(msg, 500, err);
}