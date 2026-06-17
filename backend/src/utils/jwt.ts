import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
  userId: string;
}

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (
  userId: string,
): {
  token: string;
  expiresAt: Date;
} => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const token = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return {
    token,
    expiresAt,
  };
};

export const verifyAccessToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    !("userId" in decoded)
  ) {
    throw new Error("Invalid access token payload");
  }

  return {
    userId: String(decoded.userId),
  };
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    !("userId" in decoded)
  ) {
    throw new Error("Invalid refresh token payload");
  }

  return {
    userId: String(decoded.userId),
  };
};
