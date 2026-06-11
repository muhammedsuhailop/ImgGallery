import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod"; 
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
    return;
  }

  console.error("Unexpected Error:", error);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
