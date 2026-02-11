import * as yup from "yup";

export const registerSchema = yup.object({
   name: yup.string().required("Name is required"),
   email: yup.string().email("Invalid email format").required("Email is required"),
   password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
});

export const loginSchema = yup.object({
   email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
   password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
});

export const refreshSchema = yup.object({
   refresh_token: yup.string().required("Refresh token is required"),
});

export const logoutSchema = yup.object({
   refresh_token: yup.string().required("Refresh token is required"),
});

export type RegisterRequest = yup.InferType<typeof registerSchema>
export type LoginRequest = yup.InferType<typeof loginSchema>
export type RefreshRequest = yup.InferType<typeof refreshSchema>
export type LogoutRequest = yup.InferType<typeof logoutSchema>