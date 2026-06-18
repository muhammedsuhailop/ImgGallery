import { ImageBatchResponse } from "../responses/ImageBatchResponse";
import { ImageBatchListResponse } from "../responses/ImageBatchListResponse";
import { UpdateImageItemDto } from "../dto/UpdateImageItemDto";
import { RearrangeImagesDto } from "../dto/RearrangeImagesDto";

export interface IImageService {
  uploadBatch(
    userId: string,
    files: Express.Multer.File[],
    titles: string[],
    visibility: "public" | "private",
  ): Promise<ImageBatchResponse>;

  getMyBatches(userId: string): Promise<ImageBatchListResponse>;

  getBatch(
    batchId: string,
    requestingUserId: string,
  ): Promise<ImageBatchResponse>;

  updateImageItem(
    batchId: string,
    imageId: string,
    userId: string,
    data: UpdateImageItemDto,
    file?: Express.Multer.File,
  ): Promise<ImageBatchResponse>;

  rearrangeImages(
    batchId: string,
    userId: string,
    data: RearrangeImagesDto,
  ): Promise<ImageBatchResponse>;

  deleteImageItem(
    batchId: string,
    imageId: string,
    userId: string,
  ): Promise<ImageBatchResponse>;

  deleteBatch(batchId: string, userId: string): Promise<void>;
}
