import { Response } from "express";

export interface ErrorResponse {
    message: string
}

export interface ValidationErrorResponse {
    message: string
    errors: Record<string, string[]>
}

export interface InternalErrorResponse {
    requestId: string;
    message: string
}

export const errorResponse = (res: Response, msg: string, code: number) => {
    const jsonObj: ErrorResponse = {
        message: msg,
    }
    return res.status(code).json(jsonObj)
}

export const validationErrorResponse = (res: Response, msg: string, errors: Record<string, string[]>) => {
    const jsonObj: ValidationErrorResponse = {
        message: msg,
        errors,
    }

    return res.status(422).json(jsonObj)
}

export const internalErrorResponse = (res: Response, msg: string, requestId: string) => {
    const jsonObj: InternalErrorResponse = {
        requestId,
        message: msg,
    }

    return res.status(500).json(jsonObj)
}
