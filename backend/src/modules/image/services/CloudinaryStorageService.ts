import { v2 as cloudinary } from "cloudinary";
import { IStorageService, UploadResult } from "./IStorageService";
import { ApiError } from "../../../utils/ApiError";
import { HttpStatus } from "../../../constants/httpStatus.constants";
import { StorageErrors } from "../../../constants/imageMessages.constants";
import { CloudinaryConfig } from "../../../constants/CloudinaryConfig";

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
        {
          folder: CloudinaryConfig.FOLDER,
          resource_type: CloudinaryConfig.RESOURCE_TYPE,
        },
        (error, result) => {
          if (error || !result) {
            return reject(
              new ApiError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                StorageErrors.UPLOAD_FAILED,
              ),
            );
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
