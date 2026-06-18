import { Request, Response } from "express";
import { ApiResponse } from "../../../utils/ApiResponse";
import { IAuthService } from "../services/IAuthService";
import { setAuthCookies } from "../../../utils/cookies";
import { AuthRequest } from "../../../middleware/auth.middleware";

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.register(req.body);

    res
      .status(201)
      .json(new ApiResponse(true, "Registration successful", result));
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.login(req.body);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    res.status(200).json(new ApiResponse(true, "Login successful"));
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.refreshToken(
      req.cookies.refreshToken,
    );

    setAuthCookies(res, result.accessToken, result.refreshToken);

    res.status(200).json(new ApiResponse(true, "Token refreshed"));
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    await this.authService.logout(req.cookies.refreshToken);

    res.status(200).json(new ApiResponse(true, "Logout successful"));
  };

  getMe = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;

    const result = await this.authService.getMe(authReq.userId);

    res.status(200).json(new ApiResponse(true, "User data fetched", result));
  };
}
