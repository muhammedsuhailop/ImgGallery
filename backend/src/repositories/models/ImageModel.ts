import { Schema, model, HydratedDocument, Types } from "mongoose";

export interface ImageItemPersistence {
  _id?: Schema.Types.ObjectId;
  url: string;
  publicId: string;
  title: string;
  order: number;
}

export interface ImageBatchPersistence {
  userId: Types.ObjectId | string;
  images: ImageItemPersistence[];
  title: string;
  order: number;
  visibility: "public" | "private";
  createdAt: Date;
  updatedAt: Date;
}

export type ImageBatchDocument = HydratedDocument<ImageBatchPersistence>;

const imageItemSchema = new Schema<ImageItemPersistence>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true },
  },
  { _id: true },
);

const imageBatchSchema = new Schema<ImageBatchPersistence>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 },
    images: { type: [imageItemSchema], default: [] },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
  },
  { timestamps: true },
);

export const ImageBatchModel = model<ImageBatchPersistence>(
  "ImageBatch",
  imageBatchSchema,
);
