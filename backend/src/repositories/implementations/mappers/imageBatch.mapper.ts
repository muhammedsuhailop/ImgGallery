import { ImageBatch } from "../../../domain/entities/Image";
import { ImageBatchDocument } from "../../models/ImageModel";

export const toImageBatchEntity = (
  document: ImageBatchDocument,
): ImageBatch => {
  return {
    id: document._id.toString(),
    userId: document.userId.toString(),
    images: document.images.map((img) => ({
      id: img._id ? img._id.toString() : "",
      url: img.url,
      publicId: img.publicId,
      title: img.title,
      order: img.order,
    })),
    visibility: document.visibility,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
};
