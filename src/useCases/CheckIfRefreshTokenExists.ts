import { PrismaClient } from "@prisma/client";
import { ApplicationError } from "../common/errors";
import { UseCase } from "./UseCase";

export class CheckIfRefreshTokenExists
  implements
    UseCase<CheckIfRefreshTokenExists.Params, CheckIfRefreshTokenExists.Result>
{
  constructor(private prismaClient: PrismaClient) {}

  async execute(param: CheckIfRefreshTokenExists.Params) {
    const { token, userId } = param;
    const refreshToken = await this.prismaClient.refreshToken.findFirst({
      where: {
        token: token,
        userId: userId,
      },
    });

    if (!refreshToken) {
      throw new ApplicationError({
        message: "Refresh token not found",
        statusCode: 404,
      });
    }
  }
}

export namespace CheckIfRefreshTokenExists {
  export type Params = {
    token: string;
    userId: string;
  };

  export type Result = void;
}
