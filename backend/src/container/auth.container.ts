import { UserRepository } from "../modules/auth/repositories/UserRepository";
import { RefreshTokenRepository } from "../modules/auth/repositories/RefreshTokenRepository";
import { AuthService } from "../modules/auth/services/AuthService";
import { AuthController } from "../modules/auth/controllers/AuthController";

const userRepository = new UserRepository();

const refreshTokenRepository = new RefreshTokenRepository();

const authService = new AuthService(userRepository, refreshTokenRepository);

export const authController = new AuthController(authService);
