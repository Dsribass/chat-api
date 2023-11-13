import { prismaClient } from "../constants";
import { RefreshToken } from "../models/RefreshToken";
import { UseCase } from "./UseCase";

export class SaveUserRefreshTokenUseCase
  implements UseCase<RefreshToken, void>
{
  async execute(param: RefreshToken): Promise<void> {
    await prismaClient.refreshToken.create({
      data: {
        token: param.token,
        userId: param.user_id,
        expiresIn: param.expires_in,
      },
    });
  }
}
