import { Request, Response } from "express";
import { ApiResponse } from "../../../utils/ApiResponse";
import { IAuthService } from "../services/IAuthService";
import { clearAuthCookies, setAuthCookies } from "../../../utils/cookies";
import { AuthRequest } from "../../../middleware/auth.middleware";
import { HttpStatus } from "../../../constants/httpStatus.constants";
import { AuthMessages } from "../../../constants/authMessages.constants";

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.register(req.body);

    res
      .status(HttpStatus.CREATED)
      .json(new ApiResponse(true, AuthMessages.REGISTRATION_SUCCESS, result));
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.login(req.body);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    res
      .status(HttpStatus.OK)
      .json(new ApiResponse(true, AuthMessages.LOGIN_SUCCESS));
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.refreshToken(
      req.cookies.refreshToken,
    );

    setAuthCookies(res, result.accessToken, result.refreshToken);

    res
      .status(HttpStatus.OK)
      .json(new ApiResponse(true, AuthMessages.TOKEN_REFRESHED));
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    await this.authService.logout(req.cookies.refreshToken);

    clearAuthCookies(res);

    res
      .status(HttpStatus.OK)
      .json(new ApiResponse(true, AuthMessages.LOGOUT_SUCCESS));
  };

  getMe = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;

    const result = await this.authService.getMe(authReq.userId);

    res
      .status(HttpStatus.OK)
      .json(new ApiResponse(true, AuthMessages.USER_DATA_FETCHED, result));
  };
}
