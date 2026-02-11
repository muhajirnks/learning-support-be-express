import {
   createdResponse,
   successResponse,
   tokenResponse,
} from "@/pkg/response/success";
import {
   loginService,
   logoutService,
   refreshService,
   registerService,
} from "./auth.service";
import { Request, Response } from "express";
import {
   loginSchema,
   logoutSchema,
   refreshSchema,
   registerSchema,
} from "./auth.validation";
import { validateSchema } from "@/pkg/validation/validate";

export const registerHandler = async (req: Request, res: Response) => {
   const body = await validateSchema(registerSchema, req.body);

   const user = await registerService(body as any);

   delete user.password;

   createdResponse(res, {
      data: user,
      message: "User registered successfully",
   });
};

export const loginHandler = async (req: Request, res: Response) => {
   const { email, password } = await validateSchema(loginSchema, req.body);

   const { token, data } = await loginService(email, password);

   tokenResponse(res, {
      data,
      token,
      message: "Login success",
   });
};

export const refreshHandler = async (req: Request, res: Response) => {
   const { refresh_token } = await validateSchema(refreshSchema, {
      refresh_token: req.cookies.refresh_token,
   });

   const { token } = await refreshService(refresh_token);

   tokenResponse(res, {
      token,
      message: "Refresh token success",
   });
};

export const getProfileHandler = async (req: Request, res: Response) => {
   const user = req.user!.toObject();

   successResponse(res, {
      data: user,
   });
};

export const logoutHandler = async (req: Request, res: Response) => {
   const { refresh_token } = await validateSchema(logoutSchema, {
      refresh_token: req.cookies.refresh_token,
   });

   await logoutService(refresh_token);

   // Clear Cookie
   res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
   });

   res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
   });

   successResponse(res, {
      message: "Logout success",
   });
};
