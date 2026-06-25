import { QueryFilter } from "mongoose";
import { SortOrder as MongooseSortOrder } from "mongoose";
import { ImageBatch } from "../../domain/entities/Image";
import { ImageBatchModel, ImageBatchPersistence } from "../models/ImageModel";
import {
  FindAllByUserResult,
  IImageRepository,
} from "../interfaces/IImageRepository";
import { CreateImageBatchDto } from "../../modules/image/dto/CreateImageBatchDto";
import { UpdateImageItemDto } from "../../modules/image/dto/UpdateImageItemDto";
import {
  RearrangeImagesDto,
  RearrangeBatchesDto,
} from "../../modules/image/dto/RearrangeImagesDto";
import { toImageBatchEntity } from "./mappers/imageBatch.mapper";
import { UpdateImageBatchDto } from "../../modules/image/dto/UpdateImageBatchDto";
import { GetBatchesQueryDto } from "../../modules/image/dto/GetBatchesQueryDto";

export class ImageRepository implements IImageRepository {
  async create(data: CreateImageBatchDto): Promise<ImageBatch> {
    const existingCount = await ImageBatchModel.countDocuments({
      userId: data.userId,
    });

    const images = data.images.map((img, index) => ({
      url: img.url,
      publicId: img.publicId,
      title: img.title,
      order: index,
    }));

    const batch = await ImageBatchModel.create({
      userId: data.userId,
      title: data.title,
      order: existingCount,
      images,
      visibility: data.visibility,
    });

    return toImageBatchEntity(batch);
  }

  async findAllByUser(
    userId: string,
    query: GetBatchesQueryDto,
  ): Promise<FindAllByUserResult> {
    const { page, limit, sortBy, sortOrder, visibility } = query;

    const filter: QueryFilter<ImageBatchPersistence> = { userId };

    if (visibility !== "all") {
      filter.visibility = visibility;
    }

    const sortDirection: MongooseSortOrder = sortOrder === "asc" ? 1 : -1;
    const sort: Record<string, MongooseSortOrder> = { [sortBy]: sortDirection };

    const skip = (page - 1) * limit;

    const [batches, total] = await Promise.all([
      ImageBatchModel.find(filter).sort(sort).skip(skip).limit(limit),
      ImageBatchModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      batches: batches.map(toImageBatchEntity),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
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

  async updateBatch(
    batchId: string,
    userId: string,
    data: UpdateImageBatchDto,
  ): Promise<ImageBatch | null> {
    const batch = await ImageBatchModel.findOneAndUpdate(
      { _id: batchId, userId },
      { $set: { title: data.title } },
      { new: true },
    );

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

  async rearrangeBatches(
    userId: string,
    data: RearrangeBatchesDto,
  ): Promise<ImageBatch[]> {
    const bulkOps = data.orderedBatches.map((entry) => ({
      updateOne: {
        filter: { _id: entry.batchId, userId },
        update: { $set: { order: entry.order } },
      },
    }));

    await ImageBatchModel.bulkWrite(bulkOps);

    const updated = await ImageBatchModel.find({ userId }).sort({ order: 1 });

    return updated.map(toImageBatchEntity);
  }

  async deleteImageItem(
    batchId: string,
    imageId: string,
    userId: string,
  ): Promise<ImageBatch | null> {
    const batch = await ImageBatchModel.findOneAndUpdate(
      { _id: batchId, userId },
      { $pull: { images: { _id: imageId } } },
      { new: true },
    );

    return batch ? toImageBatchEntity(batch) : null;
  }

  async deleteBatch(batchId: string, userId: string): Promise<boolean> {
    const result = await ImageBatchModel.deleteOne({ _id: batchId, userId });

    return result.deletedCount === 1;
  }
}
