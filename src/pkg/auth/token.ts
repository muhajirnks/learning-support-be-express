import { TokenSchema } from "@/internal/models/token";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Token } from "../response/success";

export const generateRefreshToken = () => {
   const bytes = crypto.randomBytes(40);
   return base64UrlEncode(bytes);
}

export const generateUserToken = (token: TokenSchema & {_id: Types.ObjectId}): Token => {
   const accessToken = jwt.sign({ type: "access", sub: token._id.toString() }, process.env.JWT_KEY!, {
      expiresIn: "1h",
   });

   return {
      type: 'Bearer',
      accessToken,
      refreshToken: token.refreshToken,
   }
}

const base64UrlEncode = (buffer: Buffer) => {
   return buffer
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
}
