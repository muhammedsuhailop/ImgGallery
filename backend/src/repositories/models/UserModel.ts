import { Schema, model, HydratedDocument } from "mongoose";

export interface UserPersistence {
  email: string;
  phoneNumber: string;
  password: string;
}

export type UserDocument = HydratedDocument<UserPersistence>;

const userSchema = new Schema<UserPersistence>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model<UserPersistence>("User", userSchema);
