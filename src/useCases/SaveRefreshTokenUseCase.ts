import { prismaClient } from "../constants";
import { RefreshToken } from "../models/RefreshToken";
import { UseCase } from "./UseCase";

export class SaveRefreshTokenUseCase implements UseCase<RefreshToken, void> {
  async execute(param: RefreshToken) {
    await prismaClient.refreshToken.create({
      data: {
        token: param.token,
        userId: param.userId,
      },
    });
  }
}
