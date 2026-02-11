import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (file: Express.Multer.File, folder: string) => {
   return new Promise<{ publicPath: string; systemPath: string }>(
      (resolve, reject) => {
         const uploadStream = cloudinary.uploader.upload_stream(
            {
               folder: process.env.CLOUDINARY_ROOT_FOLDER + '/' + folder,
               resource_type: "auto",

            },
            (error, result) => {
               if (error) return reject(error);
               if (!result)
                  return reject(new Error("Cloudinary upload failed"));

               resolve({
                  publicPath: result.secure_url,
                  systemPath: result.public_id,
               });
            },
         );

         uploadStream.end(file.buffer);
      },
   );
};

export const deleteFile = async (publicId: string) => {
   return await cloudinary.uploader.destroy(publicId);
};

/**
 * Upload file as private/authenticated
 */
export const uploadPrivateFile = async (
   file: Express.Multer.File,
   folder: string
) => {
   return new Promise<{ publicPath: string; systemPath: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
         {
            folder: process.env.CLOUDINARY_ROOT_FOLDER + '/' + folder,
            resource_type: "auto",
            type: "authenticated",
         },
         (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error("Cloudinary upload failed"));
            
            resolve({
               publicPath: result.secure_url,
               systemPath: result.public_id,
            });
         }
      );

      uploadStream.end(file.buffer);
   });
};

/**
 * Get Signed URL (Presigned URL) yang akan expired
 */
export const getPresignedUrl = (publicId: string, expiryMinutes: number = 60) => {
   const expiresAt = Math.floor(Date.now() / 1000) + (expiryMinutes * 60);
   
   return cloudinary.utils.private_download_url(publicId, "jpg", {
      resource_type: "image",
      type: "authenticated",
      expires_at: expiresAt
   });
};

export default cloudinary;
