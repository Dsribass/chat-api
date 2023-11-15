import { sign } from "jsonwebtoken";
import { User } from "../models/User";
import { config } from "./config";

export class AuthenticationHandler {
  generateAccessToken(user: User) {
    return sign({ user }, config.access_token_secret, {
      subject: user.id,
      expiresIn: config.access_token_expiration_in_seconds + "s",
    });
  }

  generateRefreshToken(user: User) {
    return sign({}, config.refresh_token_secret, {
      subject: user.id,
      expiresIn: config.refresh_token_expiration_in_days + "d",
    });
  }

  generateUserToken(user: User) {
    const refreshToken = this.generateRefreshToken(user);
    const accessToken = this.generateAccessToken(user);

    return { accessToken, refreshToken };
  }
}
