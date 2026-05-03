import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { type UploadedFile } from "express-fileupload";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryUploader = async (file: UploadedFile) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
      folder: "groovity",
    });
    return result.secure_url;
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading file to Cloudinary.");
  }
};
