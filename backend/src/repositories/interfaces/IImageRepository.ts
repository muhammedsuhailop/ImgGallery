import { ImageBatch } from "../../domain/entities/Image";
import { CreateImageBatchDto } from "../../modules/image/dto/CreateImageBatchDto";
import {
  RearrangeBatchesDto,
  RearrangeImagesDto,
} from "../../modules/image/dto/RearrangeImagesDto";
import { UpdateImageBatchDto } from "../../modules/image/dto/UpdateImageBatchDto";
import { UpdateImageItemDto } from "../../modules/image/dto/UpdateImageItemDto";
export interface IImageRepository {
  create(data: CreateImageBatchDto): Promise<ImageBatch>;

  findAllByUser(userId: string): Promise<ImageBatch[]>;

  findById(batchId: string): Promise<ImageBatch | null>;

  findByIdAndUser(batchId: string, userId: string): Promise<ImageBatch | null>;

  updateBatch(
    batchId: string,
    userId: string,
    data: UpdateImageBatchDto,
  ): Promise<ImageBatch | null>;

  updateImageItem(
    batchId: string,
    imageId: string,
    data: UpdateImageItemDto,
  ): Promise<ImageBatch | null>;

  rearrangeImages(
    batchId: string,
    data: RearrangeImagesDto,
  ): Promise<ImageBatch | null>;

  rearrangeBatches(
    userId: string,
    data: RearrangeBatchesDto,
  ): Promise<ImageBatch[]>;

  deleteImageItem(
    batchId: string,
    imageId: string,
    userId: string,
  ): Promise<ImageBatch | null>;

  deleteBatch(batchId: string, userId: string): Promise<boolean>;
}
