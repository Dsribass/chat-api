import { sign } from "jsonwebtoken";
import { User } from "../models/user";

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
}
