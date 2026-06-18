import { User } from "../../../domain/entities/User";
import { UserDocument } from "../../models/UserModel";

export const toUserEntity = (document: UserDocument): User => {
  return {
    id: document._id.toString(),
    name: document.name,
    email: document.email,
    phoneNumber: document.phoneNumber,
    password: document.password,
  };
};
