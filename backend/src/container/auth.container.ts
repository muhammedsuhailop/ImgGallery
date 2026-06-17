import { UserRepository } from "../modules/auth/repositories/UserRepository";
import { RefreshTokenRepository } from "../modules/auth/repositories/RefreshTokenRepository";
import { AuthService } from "../modules/auth/services/AuthService";
import { AuthController } from "../modules/auth/controllers/AuthController";
import { IAuthService } from "../modules/auth/services/IAuthService";

const userRepository = new UserRepository();

const refreshTokenRepository = new RefreshTokenRepository();

const authService: IAuthService = new AuthService(
  userRepository,
  refreshTokenRepository,
);

export const authController = new AuthController(authService);
