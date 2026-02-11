import Token from "@/internal/models/token";
import User from "@/internal/models/user";

export const findByEmail = async (email: string) => {
   return await User.findOne({ email }).lean().exec();
};

export const createUser = async (data: any) => {
   const result = await User.create(data);
   return result.toObject();
};

export const findToken = async (token: string) => {
   return await Token.findOne({ refreshToken: token }).lean().exec();
};

export const deleteToken = async (token: string) => {
   return await Token.deleteOne({ refreshToken: token }).exec();
};

export const createToken = async (userId: string, refreshToken: string) => {
   const result = await Token.create({
      userId,
      refreshToken,
      lastUsed: new Date(),
   });

   return result.toObject();
};

export const findById = async (id: string) => {
   return await User.findById(id).select("-password").lean().exec();
};