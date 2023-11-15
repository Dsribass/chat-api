import { PrismaClient } from "@prisma/client";
import { UseCase } from "./UseCase";

export class SaveRefreshToken
  implements UseCase<SaveRefreshToken.Params, SaveRefreshToken.Result>
{
  constructor(private prismaClient: PrismaClient) {}

  async execute(param: SaveRefreshToken.Params) {
    await this.prismaClient.refreshToken.create({
      data: {
        token: param.token,
        userId: param.userId,
      },
    });
  }
}

export namespace SaveRefreshToken {
  export type Params = {
    token: string;
    userId: string;
  };

  export type Result = void;
}
