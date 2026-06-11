import { ApiError } from "../../../utils/ApiError";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../utils/jwt";
import { hashToken } from "../../../utils/tokenHash";
import { comparePassword, hashPassword } from "../../../utils/hash";
import { RegisterDto } from "../dto/RegisterDto";
import { LoginDto } from "../dto/LoginDto";
import { IUserRepository } from "../repositories/IUserRepository";
import { IRefreshTokenRepository } from "../repositories/IRefreshTokenRepository";

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,

    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async register(data: RegisterDto) {
    const existingEmail = await this.userRepository.findByEmail(data.email);

    if (existingEmail) {
      throw new ApiError(409, "Email already exists");
    }

    const existingPhone = await this.userRepository.findByPhoneNumber(
      data.phoneNumber,
    );

    if (existingPhone) {
      throw new ApiError(409, "Phone number already exists");
    }

    const password = await hashPassword(data.password);

    const user = await this.userRepository.create({
      ...data,
      password,
    });

    return {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
  }

  async login(data: LoginDto) {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isValid = await comparePassword(data.password, user.password);

    if (!isValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = generateAccessToken(user.id);

    const refreshData = generateRefreshToken(user.id);

    await this.refreshTokenRepository.create(
      user.id,
      hashToken(refreshData.token),
      refreshData.expiresAt,
    );

    return {
      accessToken,
      refreshToken: refreshData.token,
    };
  }

  async refreshToken(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    const storedToken = await this.refreshTokenRepository.findByToken(
      hashToken(refreshToken),
    );

    if (!storedToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const accessToken = generateAccessToken(payload.userId);

    return {
      accessToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenRepository.deleteByToken(hashToken(refreshToken));
  }
}
