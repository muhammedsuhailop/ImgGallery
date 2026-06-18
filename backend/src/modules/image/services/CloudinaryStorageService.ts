import { v2 as cloudinary } from "cloudinary";
import { IStorageService, UploadResult } from "./IStorageService";
import { ApiError } from "../../../utils/ApiError";

export class CloudinaryStorageService implements IStorageService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async upload(file: Express.Multer.File): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "img-gallery", resource_type: "image" },
        (error, result) => {
          if (error || !result) {
            return reject(new ApiError(500, "Image upload failed"));
          }

          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      );

      stream.end(file.buffer);
    });
  }

  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
