import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { errorHandler } from "../utils/errorHandler.js";

cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

// const uploadToClodinary = async (filePath, folder, next)=>{
// const uploadToClodinary = async (req, folder, next)=>{
const uploadToClodinary = async (filePath, folder, next) => {
  // if(!req.file) return next(errorHandler(400, "no file uploaded"))
  if (!filePath) return next(errorHandler(400, "no file uploaded"));

  // const localPath = req.file.path
  const localPath = filePath;

  try {
    // const result = await cloudinary.uploader.upload(filePath,{
    const result = await cloudinary.uploader.upload(localPath, {
      folder,
    });

    fs.unlinkSync(localPath);
    return result;
  } catch (error) {
    console.log("cloudinar controller m h error", error);
    return next(error);
  }
};

export default uploadToClodinary;
