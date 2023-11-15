import { RefreshToken } from "@prisma/client";
import { ApplicationError } from "../common/errors";
import { prismaClient } from "../constants";
import { UseCase } from "./UseCase";

interface CheckIfRefreshTokenExistsUseCaseParams {
  token: string;
  userId: string;
}

export class CheckIfRefreshTokenExistsUseCase
  implements UseCase<CheckIfRefreshTokenExistsUseCaseParams, void>
{
  async execute(param: CheckIfRefreshTokenExistsUseCaseParams) {
    const { token, userId } = param;
    const refreshToken = await prismaClient.refreshToken.findFirst({
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
