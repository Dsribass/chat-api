import { prismaClient } from "../constants";
import { UseCase } from "./UseCase";

interface SaveRefreshTokenParam {
  token: string;
  userId: string;
}

export class SaveRefreshTokenUseCase
  implements UseCase<SaveRefreshTokenParam, void>
{
  async execute(param: SaveRefreshTokenParam) {
    await prismaClient.refreshToken.create({
      data: {
        token: param.token,
        userId: param.userId,
      },
    });
  }
}
