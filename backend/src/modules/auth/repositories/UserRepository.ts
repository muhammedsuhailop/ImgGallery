import { User } from "../../../domain/entities/User";

import { UserModel } from "../../../models/UserModel";

import { RegisterDto } from "../dto/RegisterDto";

import { IUserRepository } from "./IUserRepository";

import { toUserEntity } from "./mappers/user.mapper";

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);

    return user ? toUserEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({
      email,
    });

    return user ? toUserEntity(user) : null;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const user = await UserModel.findOne({
      phoneNumber,
    });

    return user ? toUserEntity(user) : null;
  }

  async create(data: RegisterDto): Promise<User> {
    const user = await UserModel.create(data);

    return toUserEntity(user);
  }
}
