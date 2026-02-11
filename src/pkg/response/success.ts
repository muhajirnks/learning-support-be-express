import { Response } from "express";
import { PaginationResult } from "../pagination/models";

export interface SuccessResponse<T> {
   message?: string;
   data?: T;
}

export interface Token {
   type: string;
   accessToken: string;
   refreshToken: string;
}

export interface TokenResponse<T> {
   message: string;
   token: Token;
   data?: T;
}

export const successResponse = <T>(
   res: Response,
   payload: SuccessResponse<T>
) => {
   const { data, message } = payload;

   return res.status(200).json({
      message,
      data: data ? data : undefined,
   });
};

export const paginationResponse = <T>(
   res: Response,
   data: PaginationResult<T>
) => {
   return res.status(200).json(data);
};

export const createdResponse = <T>(
   res: Response,
   payload: SuccessResponse<T>
) => {
   const { data, message } = payload;

   return res.status(201).json({
      message,
      data: data ? data : undefined,
   });
};

export const tokenResponse = <T>(res: Response, payload: TokenResponse<T>) => {
   const { data, message, token } = payload;

   res.cookie("access_token", token.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 5 * 60 * 60 * 1000, // 5 hours
   });

   res.cookie("refresh_token", token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
   });

   return res.status(201).json({
      message,
      data: data,
   });
};
