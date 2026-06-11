import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { ApiResponse } from "../../../utils/ApiResponse";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.register(req.body);

    res
      .status(201)
      .json(new ApiResponse(true, "Registration successful", result));
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.login(req.body);

    res.status(200).json(new ApiResponse(true, "Login successful", result));
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.refreshToken(req.body.refreshToken);

    res.status(200).json(new ApiResponse(true, "Token refreshed", result));
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    await this.authService.logout(req.body.refreshToken);

    res.status(200).json(new ApiResponse(true, "Logout successful"));
  };
}
