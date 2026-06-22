import { ImageBatchResponse } from "../responses/ImageBatchResponse";
import { ImageBatchListResponse, RearrangeBatchesResponse } from "../responses/ImageBatchListResponse";
import { UpdateImageItemDto } from "../dto/UpdateImageItemDto";
import { RearrangeBatchesDto, RearrangeImagesDto } from "../dto/RearrangeImagesDto";
import { UpdateImageBatchDto } from "../dto/UpdateImageBatchDto";

export interface IImageService {
  uploadBatch(
    userId: string,
    files: Express.Multer.File[],
    titles: string[],
    batchTitle: string,
    visibility: "public" | "private",
  ): Promise<ImageBatchResponse>;
  getMyBatches(userId: string): Promise<ImageBatchListResponse>;

  getBatch(
    batchId: string,
    requestingUserId: string,
  ): Promise<ImageBatchResponse>;

  updateBatch( 
    batchId: string,
    userId: string,
    data: UpdateImageBatchDto,
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

  rearrangeBatches(
    userId: string,
    data: RearrangeBatchesDto,
  ): Promise<RearrangeBatchesResponse>;

  deleteImageItem(
    batchId: string,
    imageId: string,
    userId: string,
  ): Promise<ImageBatchResponse>;

  deleteBatch(batchId: string, userId: string): Promise<void>;
}
