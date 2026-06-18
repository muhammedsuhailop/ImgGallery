import { ImageBatch } from "../../domain/entities/Image";
import { CreateImageBatchDto } from "../../modules/image/dto/CreateImageBatchDto";
import { RearrangeImagesDto } from "../../modules/image/dto/RearrangeImagesDto";
import { UpdateImageItemDto } from "../../modules/image/dto/UpdateImageItemDto";
export interface IImageRepository {
  create(data: CreateImageBatchDto): Promise<ImageBatch>;

  findAllByUser(userId: string): Promise<ImageBatch[]>;

  findById(batchId: string): Promise<ImageBatch | null>;

  findByIdAndUser(batchId: string, userId: string): Promise<ImageBatch | null>;

  updateImageItem(
    batchId: string,
    imageId: string,
    data: UpdateImageItemDto,
  ): Promise<ImageBatch | null>;

  rearrangeImages(
    batchId: string,
    data: RearrangeImagesDto,
  ): Promise<ImageBatch | null>;

  deleteImageItem(
    batchId: string,
    imageId: string,
    userId: string,
  ): Promise<ImageBatch | null>;

  deleteBatch(batchId: string, userId: string): Promise<boolean>;
}
