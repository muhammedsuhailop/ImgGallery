import { RefreshTokenRepository } from "../repositories/implementations/RefreshTokenRepository";
import { AuthService } from "../modules/auth/services/AuthService";
import { AuthController } from "../modules/auth/controllers/AuthController";
import { IAuthService } from "../modules/auth/services/IAuthService";
import { UserRepository } from "../repositories/implementations/UserRepository";

const userRepository = new UserRepository();

const refreshTokenRepository = new RefreshTokenRepository();

const authService: IAuthService = new AuthService(
  userRepository,
  refreshTokenRepository,
);

export const authController = new AuthController(authService);
