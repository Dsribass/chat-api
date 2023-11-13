import { sign } from "jsonwebtoken";
import { User } from "../models/User";
import { config } from "./config";
import dayjs from "dayjs";

export class AuthenticationHandler {
  async generateUserToken(user: User) {
    const refreshTokenExpirationInTimeStamps = dayjs()
      .add(config.refresh_token_expiration_in_days, "day")
      .unix();

    const refreshToken = {
      token: sign({}, config.refresh_token_secret, {
        subject: user.id,
        expiresIn: config.refresh_token_expiration_in_days + "d",
      }),
      user_id: user.id,
      expires_in: refreshTokenExpirationInTimeStamps,
    };

    const accessToken = sign({ user }, config.access_token_secret, {
      subject: user.id,
      expiresIn: config.access_token_expiration_in_seconds + "s",
    });

    return { accessToken, refreshToken };
  }
}
