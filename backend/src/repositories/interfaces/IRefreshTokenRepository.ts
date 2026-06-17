import { RefreshToken } from "../../domain/entities/RefreshToken";

export interface IRefreshTokenRepository {
  create(userId: string, token: string, expiresAt: Date): Promise<RefreshToken>;

  findByToken(token: string): Promise<RefreshToken | null>;

  deleteByToken(token: string): Promise<void>;

  deleteByUserId(userId: string): Promise<void>;
}
