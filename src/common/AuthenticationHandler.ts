import { sign } from "jsonwebtoken";
import { User } from "../models/User";
import { config } from "./config";

export class AuthenticationHandler {
  async generateUserToken(user: User) {
    const refreshToken = sign({}, config.refresh_token_secret, {
      subject: user.id,
      expiresIn: config.refresh_token_expiration_in_days + "d",
    });

    const accessToken = sign({ user }, config.access_token_secret, {
      subject: user.id,
      expiresIn: config.access_token_expiration_in_seconds + "s",
    });

    return { accessToken, refreshToken };
  }
}
