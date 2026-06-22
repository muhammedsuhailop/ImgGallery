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
import { IUserRepository } from "../../../repositories/interfaces/IUserRepository";
import { IRefreshTokenRepository } from "../../../repositories/interfaces/IRefreshTokenRepository";
import { RegisterResponse } from "../responses/RegisterResponse";
import { RefreshTokenResponse } from "../responses/RefreshTokenResponse";
import { LoginResponse } from "../responses/LoginResponse";
import { IAuthService } from "./IAuthService";
import { MeResponse } from "../responses/MeResponse";
import { ResetPasswordDto } from "../dto/ResetPasswordDto";
import { HttpStatus } from "../../../constants/httpStatus.constants";
import { AuthErrors } from "../../../constants/authMessages.constants";

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async register(data: RegisterDto): Promise<RegisterResponse> {
    const existingEmail = await this.userRepository.findByEmail(data.email);

    if (existingEmail) {
      throw new ApiError(HttpStatus.BAD_REQUEST, AuthErrors.EMAIL_EXISTS);
    }

    const existingPhone = await this.userRepository.findByPhoneNumber(
      data.phoneNumber,
    );

    if (existingPhone) {
      throw new ApiError(HttpStatus.BAD_REQUEST, AuthErrors.PHONE_EXISTS);
    }

    const password = await hashPassword(data.password);

    const user = await this.userRepository.create({
      ...data,
      password,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    };
  }

  async login(data: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new ApiError(
        HttpStatus.UNAUTHORIZED,
        AuthErrors.INVALID_CREDENTIALS,
      );
    }

    const isValid = await comparePassword(data.password, user.password);

    if (!isValid) {
      throw new ApiError(
        HttpStatus.UNAUTHORIZED,
        AuthErrors.INVALID_CREDENTIALS,
      );
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

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const payload = verifyRefreshToken(refreshToken);

    const storedToken = await this.refreshTokenRepository.findByToken(
      hashToken(refreshToken),
    );

    if (!storedToken) {
      throw new ApiError(
        HttpStatus.UNAUTHORIZED,
        AuthErrors.INVALID_REFRESH_TOKEN,
      );
    }

    await this.refreshTokenRepository.deleteByToken(hashToken(refreshToken));

    const accessToken = generateAccessToken(payload.userId);

    const newRefresh = generateRefreshToken(payload.userId);

    await this.refreshTokenRepository.create(
      payload.userId,
      hashToken(newRefresh.token),
      newRefresh.expiresAt,
    );

    return {
      accessToken,
      refreshToken: newRefresh.token,
    };
  }

  async logout(refreshToken?: string): Promise<void> {
    if (!refreshToken) {
      return;
    }

    await this.refreshTokenRepository.deleteByToken(hashToken(refreshToken));
  }

  async getMe(userId: string): Promise<MeResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, AuthErrors.USER_NOT_FOUND);
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    };
  }

  async resetPassword(userId: string, data: ResetPasswordDto): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, AuthErrors.USER_NOT_FOUND);
    }

    const isValid = await comparePassword(data.currentPassword, user.password);

    if (!isValid) {
      throw new ApiError(
        HttpStatus.BAD_REQUEST,
        AuthErrors.INCORRECT_CURRENT_PASSWORD,
      );
    }

    if (data.currentPassword === data.newPassword) {
      throw new ApiError(HttpStatus.BAD_REQUEST, AuthErrors.SAME_PASSWORD);
    }

    const hashed = await hashPassword(data.newPassword);

    await this.userRepository.updatePassword(userId, hashed);

    await this.refreshTokenRepository.deleteByUserId(userId);
  }
}
