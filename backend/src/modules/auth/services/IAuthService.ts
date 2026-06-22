import { LoginDto } from "../dto/LoginDto";
import { RegisterDto } from "../dto/RegisterDto";
import { ResetPasswordDto } from "../dto/ResetPasswordDto";
import { LoginResponse } from "../responses/LoginResponse";
import { MeResponse } from "../responses/MeResponse";
import { RefreshTokenResponse } from "../responses/RefreshTokenResponse";
import { RegisterResponse } from "../responses/RegisterResponse";

export interface IAuthService {
  register(data: RegisterDto): Promise<RegisterResponse>;

  login(data: LoginDto): Promise<LoginResponse>;

  refreshToken(refreshToken: string): Promise<RefreshTokenResponse>;

  logout(refreshToken?: string): Promise<void>;

  getMe(userId: string): Promise<MeResponse>;

  resetPassword(userId: string, data: ResetPasswordDto): Promise<void>;
}
