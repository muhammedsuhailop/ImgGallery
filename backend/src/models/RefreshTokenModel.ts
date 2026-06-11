import { Schema, model, HydratedDocument, Types } from "mongoose";

export interface RefreshTokenPersistence {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
}

export type RefreshTokenDocument = HydratedDocument<RefreshTokenPersistence>;

const refreshTokenSchema = new Schema<RefreshTokenPersistence>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

refreshTokenSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  },
);

export const RefreshTokenModel = model<RefreshTokenPersistence>(
  "RefreshToken",
  refreshTokenSchema,
);
