import { ImageBatch } from "../../domain/entities/Image";
import {
  ImageBatchModel,
  ImageBatchDocument,
  ImageBatchPersistence,
} from "../models/ImageModel";
import { IImageRepository } from "../interfaces/IImageRepository";
import { toImageBatchEntity } from "./mappers/imageBatch.mapper";
import { CreateImageBatchDto } from "../../modules/image/dto/CreateImageBatchDto";
import { UpdateImageItemDto } from "../../modules/image/dto/UpdateImageItemDto";
import { RearrangeImagesDto } from "../../modules/image/dto/RearrangeImagesDto";

export class ImageRepository implements IImageRepository {
  async create(data: CreateImageBatchDto): Promise<ImageBatch> {
    const images = data.images.map((img, index) => ({
      url: img.url,
      publicId: img.publicId,
      title: img.title,
      order: index,
    }));

    const batch = await ImageBatchModel.create({
      userId: data.userId,
      images,
      visibility: data.visibility,
    });

    return toImageBatchEntity(batch);
  }

  async findAllByUser(userId: string): Promise<ImageBatch[]> {
    const batches = await ImageBatchModel.find({ userId }).sort({
      createdAt: -1,
    });

    return batches.map(toImageBatchEntity);
  }

  async findById(batchId: string): Promise<ImageBatch | null> {
    const batch = await ImageBatchModel.findById(batchId);

    return batch ? toImageBatchEntity(batch) : null;
  }

  async findByIdAndUser(
    batchId: string,
    userId: string,
  ): Promise<ImageBatch | null> {
    const batch = await ImageBatchModel.findOne({ _id: batchId, userId });

    return batch ? toImageBatchEntity(batch) : null;
  }

  async updateImageItem(
    batchId: string,
    imageId: string,
    data: UpdateImageItemDto,
  ): Promise<ImageBatch | null> {
    const setFields: Record<string, string> = {};

    if (data.title !== undefined) setFields["images.$.title"] = data.title;
    if (data.url !== undefined) setFields["images.$.url"] = data.url;
    if (data.publicId !== undefined)
      setFields["images.$.publicId"] = data.publicId;

    const queryCriteria: { _id: string; [key: string]: string } = {
      _id: batchId,
      "images._id": imageId,
    };

    const batch = await ImageBatchModel.findOne(queryCriteria);

    if (!batch) return null;

    await ImageBatchModel.updateOne(queryCriteria, { $set: setFields });

    const updatedBatch = await ImageBatchModel.findById(batchId);

    return updatedBatch ? toImageBatchEntity(updatedBatch) : null;
  }

  async rearrangeImages(
    batchId: string,
    data: RearrangeImagesDto,
  ): Promise<ImageBatch | null> {
    const batch = await ImageBatchModel.findById(batchId);

    if (!batch) return null;

    const orderMap = new Map(
      data.orderedImages.map((entry) => [entry.imageId, entry.order]),
    );

    batch.images.forEach((img) => {
      const structuralImg = img as typeof img & { _id: { toString(): string } };
      const newOrder = orderMap.get(structuralImg._id.toString());

      if (newOrder !== undefined) {
        img.order = newOrder;
      }
    });

    batch.images.sort((a, b) => a.order - b.order);

    await batch.save();

    return toImageBatchEntity(batch);
  }

  async deleteImageItem(
    batchId: string,
    imageId: string,
    userId: string,
  ): Promise<ImageBatch | null> {
    const result = await ImageBatchModel.findOneAndUpdate(
      { _id: batchId, userId },
      { $pull: { images: { _id: imageId } } },
      { new: true },
    );

    const batch = result as unknown as ImageBatchDocument | null;

    return batch ? toImageBatchEntity(batch) : null;
  }

  async deleteBatch(batchId: string, userId: string): Promise<boolean> {
    const result = await ImageBatchModel.deleteOne({ _id: batchId, userId });

    return result.deletedCount === 1;
  }
}
