import {
   createToken,
   createUser,
   deleteToken,
   findByEmail,
   findById,
   findToken,
} from "./auth.repo";
import bcrypt from "bcrypt";
import { NewBadRequestError, NewConflictError } from "@/pkg/apperror/appError";
import { RegisterRequest } from "./auth.validation";
import { generateRefreshToken, generateUserToken } from "@/pkg/auth/token";

export const registerService = async (data: RegisterRequest) => {
   const existUser = await findByEmail(data.email!);

   if (existUser) {
      throw NewConflictError("Email already exist");
   }

   const user = await createUser(data);

   return user;
};

export const loginService = async (email: string, password: string) => {
   const user = await findByEmail(email);

   if (!user) {
      throw NewBadRequestError("Bad Credential");
   }

   // Check Password
   const checkPassword = await bcrypt.compare(password, user.password!);

   if (!checkPassword) {
      throw NewBadRequestError("Bad Credential");
   }

   // Store Refresh Token
   const refToken = await createToken(
      user._id.toString(),
      generateRefreshToken(),
   );

   // Generate JWT Token
   const token = generateUserToken(refToken);


   delete user.password;

   return {
      token,
      data: user,
   };
};

export const refreshService = async (token: string) => {
   const storedToken = await findToken(token);

   if (!storedToken) {
      throw NewBadRequestError("Invalid refresh token");
   }

   const user = await findById(storedToken.userId.toString());

   if (!user) {
      throw NewBadRequestError("User not found");
   }

   const refToken = await createToken(
      user._id.toString(),
      generateRefreshToken(),
   );

   // Generate JWT Token
   const userToken = generateUserToken(refToken);
   await deleteToken(token);

   return {
      token: userToken,
   };
};

export const logoutService = async (token: string) => {
   return deleteToken(token);
};
