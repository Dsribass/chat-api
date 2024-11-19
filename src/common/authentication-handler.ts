import { sign, verify } from "jsonwebtoken";
import { User } from "../models/user";
import { ApplicationError, ErrorType } from "./errors";

export class AuthenticationHandler {
  generateAccessToken(user: User) {
    return sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      subject: user.id,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME,
    });
  }

  generateRefreshToken(user: User) {
    return sign({}, process.env.REFRESH_TOKEN_SECRET, {
      subject: user.id,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME,
    });
  }

  generateUserToken(user: User) {
    const refreshToken = this.generateRefreshToken(user);
    const accessToken = this.generateAccessToken(user);

    return { accessToken, refreshToken };
  }

  verifyToken(token: string) {
    try {
      verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (_) {
      throw new ApplicationError({
        type: ErrorType.INVALID_TOKEN,
        message: "Invalid token",
        statusCode: 401,
      });
    }
  }
}
