import { ImageRepository } from "../repositories/implementations/ImageRepository";
import { CloudinaryStorageService } from "../modules/image/services/CloudinaryStorageService";
import { ImageService } from "../modules/image/services/ImageService";
import { ImageController } from "../modules/image/controllers/ImageController";
import { IImageService } from "../modules/image/services/IImageService";

const imageRepository = new ImageRepository();

const storageService = new CloudinaryStorageService();

const imageService: IImageService = new ImageService(
  imageRepository,
  storageService,
);

export const imageController = new ImageController(imageService);
