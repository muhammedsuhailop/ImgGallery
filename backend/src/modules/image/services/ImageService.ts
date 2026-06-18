import { IImageService } from "./IImageService";
import { IImageRepository } from "../../../repositories/interfaces/IImageRepository";
import { IStorageService } from "./IStorageService";
import { ApiError } from "../../../utils/ApiError";
import { ImageBatch } from "../../../domain/entities/Image";
import {
  ImageBatchResponse,
  ImageItemResponse,
} from "../responses/ImageBatchResponse";
import {
  ImageBatchListResponse,
  RearrangeBatchesResponse,
} from "../responses/ImageBatchListResponse";
import { UpdateImageItemDto } from "../dto/UpdateImageItemDto";
import {
  RearrangeImagesDto,
  RearrangeBatchesDto,
} from "../dto/RearrangeImagesDto";
import { UpdateImageBatchDto } from "../dto/UpdateImageBatchDto";

export class ImageService implements IImageService {
  constructor(
    private readonly imageRepository: IImageRepository,
    private readonly storageService: IStorageService,
  ) {}

  private toResponse(batch: ImageBatch): ImageBatchResponse {
    const images: ImageItemResponse[] = batch.images.map((img) => ({
      imageId: img.id,
      url: img.url,
      title: img.title,
      order: img.order,
    }));

    return {
      batchId: batch.id,
      title: batch.title,
      order: batch.order,
      visibility: batch.visibility,
      images,
      createdAt: batch.createdAt,
      updatedAt: batch.updatedAt,
    };
  }

  async uploadBatch(
    userId: string,
    files: Express.Multer.File[],
    titles: string[],
    batchTitle: string,
    visibility: "public" | "private",
  ): Promise<ImageBatchResponse> {
    if (!files.length) {
      throw new ApiError(400, "At least one image is required");
    }

    if (files.length !== titles.length) {
      throw new ApiError(400, "Each image must have a corresponding title");
    }

    const uploadResults = await Promise.all(
      files.map((file) => this.storageService.upload(file)),
    );

    const images = uploadResults.map((result, index) => ({
      url: result.url,
      publicId: result.publicId,
      title: titles[index],
    }));

    const batch = await this.imageRepository.create({
      userId,
      title: batchTitle,
      images,
      visibility,
    });

    return this.toResponse(batch);
  }

  async getMyBatches(userId: string): Promise<ImageBatchListResponse> {
    const batches = await this.imageRepository.findAllByUser(userId);

    return { batches: batches.map((batch) => this.toResponse(batch)) };
  }

  async getBatch(
    batchId: string,
    requestingUserId: string,
  ): Promise<ImageBatchResponse> {
    const batch = await this.imageRepository.findById(batchId);

    if (!batch) {
      throw new ApiError(404, "Batch not found");
    }

    const isOwner = batch.userId === requestingUserId;

    if (!isOwner && batch.visibility === "private") {
      throw new ApiError(403, "Access denied");
    }

    return this.toResponse(batch);
  }

  async updateBatch(
    batchId: string,
    userId: string,
    data: UpdateImageBatchDto,
  ): Promise<ImageBatchResponse> {
    const existing = await this.imageRepository.findByIdAndUser(
      batchId,
      userId,
    );

    if (!existing) {
      throw new ApiError(404, "Batch not found or access denied");
    }

    const updated = await this.imageRepository.updateBatch(
      batchId,
      userId,
      data,
    );

    if (!updated) {
      throw new ApiError(500, "Failed to update batch");
    }

    return this.toResponse(updated);
  }

  async updateImageItem(
    batchId: string,
    imageId: string,
    userId: string,
    data: UpdateImageItemDto,
    file?: Express.Multer.File,
  ): Promise<ImageBatchResponse> {
    const existing = await this.imageRepository.findByIdAndUser(
      batchId,
      userId,
    );

    if (!existing) {
      throw new ApiError(404, "Batch not found or access denied");
    }

    const imageToUpdate = existing.images.find((img) => img.id === imageId);

    if (!imageToUpdate) {
      throw new ApiError(404, "Image not found in this batch");
    }

    const updateData: UpdateImageItemDto = { ...data };

    if (file) {
      await this.storageService.delete(imageToUpdate.publicId);

      const uploaded = await this.storageService.upload(file);

      updateData.url = uploaded.url;
      updateData.publicId = uploaded.publicId;
    }

    const updated = await this.imageRepository.updateImageItem(
      batchId,
      imageId,
      updateData,
    );

    if (!updated) {
      throw new ApiError(500, "Failed to update image");
    }

    return this.toResponse(updated);
  }

  async rearrangeImages(
    batchId: string,
    userId: string,
    data: RearrangeImagesDto,
  ): Promise<ImageBatchResponse> {
    const existing = await this.imageRepository.findByIdAndUser(
      batchId,
      userId,
    );

    if (!existing) {
      throw new ApiError(404, "Batch not found or access denied");
    }

    const updated = await this.imageRepository.rearrangeImages(batchId, data);

    if (!updated) {
      throw new ApiError(500, "Failed to rearrange images");
    }

    return this.toResponse(updated);
  }

  async rearrangeBatches(
    userId: string,
    data: RearrangeBatchesDto,
  ): Promise<RearrangeBatchesResponse> {
    const updatedBatches = await this.imageRepository.rearrangeBatches(
      userId,
      data,
    );

    return { batches: updatedBatches.map((batch) => this.toResponse(batch)) };
  }

  async deleteImageItem(
    batchId: string,
    imageId: string,
    userId: string,
  ): Promise<ImageBatchResponse> {
    const existing = await this.imageRepository.findByIdAndUser(
      batchId,
      userId,
    );

    if (!existing) {
      throw new ApiError(404, "Batch not found or access denied");
    }

    const imageToDelete = existing.images.find((img) => img.id === imageId);

    if (!imageToDelete) {
      throw new ApiError(404, "Image not found in this batch");
    }

    await this.storageService.delete(imageToDelete.publicId);

    const updated = await this.imageRepository.deleteImageItem(
      batchId,
      imageId,
      userId,
    );

    if (!updated) {
      throw new ApiError(500, "Failed to delete image");
    }

    return this.toResponse(updated);
  }

  async deleteBatch(batchId: string, userId: string): Promise<void> {
    const existing = await this.imageRepository.findByIdAndUser(
      batchId,
      userId,
    );

    if (!existing) {
      throw new ApiError(404, "Batch not found or access denied");
    }

    await Promise.all(
      existing.images.map((img) => this.storageService.delete(img.publicId)),
    );

    await this.imageRepository.deleteBatch(batchId, userId);
  }
}
