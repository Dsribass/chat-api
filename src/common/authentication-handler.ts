import { sign } from "jsonwebtoken";
import { User } from "../models/user";
import env from "./env";

export class AuthenticationHandler {
  generateAccessToken(user: User) {
    return sign({ user }, env.access_token_secret, {
      subject: user.id,
      expiresIn: env.access_token_expiration_in_seconds + "s",
    });
  }

  generateRefreshToken(user: User) {
    return sign({}, env.refresh_token_secret, {
      subject: user.id,
      expiresIn: env.refresh_token_expiration_in_days + "d",
    });
  }

  generateUserToken(user: User) {
    const refreshToken = this.generateRefreshToken(user);
    const accessToken = this.generateAccessToken(user);

    return { accessToken, refreshToken };
  }
}
