import * as Minio from "minio";
import dotenv from "dotenv";

dotenv.config();

const minioClient = new Minio.Client({
   endPoint: process.env.MINIO_ENDPOINT || "localhost",
   port: parseInt(process.env.MINIO_PORT || "9000"),
   useSSL: process.env.MINIO_USE_SSL === "true",
   accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
   secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
   pathStyle: true,
});

const bucketName = process.env.MINIO_BUCKET_NAME || "toko-online";

// Ensure bucket exists
export const initMinio = async () => {
   const exists = await minioClient.bucketExists(bucketName);
   if (!exists) {
      await minioClient.makeBucket(bucketName);
      console.log(`Bucket ${bucketName} created successfully.`);
   }

   console.log(`Bucket ${bucketName} policy set to public read.`);
   setPublic()
};

const setPublic = async () => {
   // Set bucket policy to public read
   const policy = {
      Version: "2012-10-17",
      Statement: [
         {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${bucketName}/*`],
         },
      ],
   };

   await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
}

export const uploadFile = async (
   file: Express.Multer.File,
   folder: string,
) => {
   const fileName = `${folder}/${Date.now()}-${file.originalname}`;
   await minioClient.putObject(bucketName, fileName, file.buffer, file.size, {
      "Content-Type": file.mimetype,
   });

   return {
      publicPath: `${bucketName}/${fileName}`,
      systemPath: `${fileName}`
   };
};

export const deleteFile = async (fileName: string) => {
   await minioClient.removeObject(bucketName, fileName);
};

export default minioClient;
export const presignGetUrl = async (objectName: string, expirySeconds: number = 3600) => {
   const url = await minioClient.presignedGetObject(bucketName, objectName, expirySeconds);

   return url.replace(`http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`, process.env.MINIO_BASE_URL!)
};
