import { Types } from "mongoose";

import { RefreshToken } from "../../../domain/entities/RefreshToken";

import { RefreshTokenModel } from "../../../models/RefreshTokenModel";

import { IRefreshTokenRepository } from "./IRefreshTokenRepository";

import { toRefreshTokenEntity } from "./mappers/refreshToken.mapper";

export class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    const refreshToken = await RefreshTokenModel.create({
      userId: new Types.ObjectId(userId),

      token,

      expiresAt,
    });

    return toRefreshTokenEntity(refreshToken);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = await RefreshTokenModel.findOne({
      token,
    });

    return refreshToken ? toRefreshTokenEntity(refreshToken) : null;
  }

  async deleteByToken(token: string): Promise<void> {
    await RefreshTokenModel.deleteOne({
      token,
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await RefreshTokenModel.deleteMany({
      userId: new Types.ObjectId(userId),
    });
  }
}
