import { PrismaClient } from "@prisma/client";
import { ApplicationError, ErrorType } from "../common";

export interface ITokenService {
  persistRefreshToken: (
    params: ITokenService.PersistRefreshTokenParams
  ) => Promise<void>;
  checkIfRefreshTokenExists: (params: ITokenService.CheckIfRefreshTokenExistsParams) => Promise<void>;
}

export class TokenService implements ITokenService {
  constructor(private prismaClient: PrismaClient) {}

  async persistRefreshToken(param: ITokenService.PersistRefreshTokenParams) {
    await this.prismaClient.refreshToken.create({
      data: {
        token: param.token,
        userId: param.userId,
      },
    });
  }

  async checkIfRefreshTokenExists(param: ITokenService.CheckIfRefreshTokenExistsParams) {
    const { token, userId } = param;
    const refreshToken = await this.prismaClient.refreshToken.findFirst({
      where: {
        token: token,
        userId: userId,
      },
    });

    if (!refreshToken) {
      throw new ApplicationError({
        type: ErrorType.ITEM_NOT_FOUND,
        message: "Refresh token not found",
        statusCode: 404,
      });
    }
  }
}

namespace ITokenService {
  export type PersistRefreshTokenParams = {
    token: string;
    userId: string;
  };

  export type CheckIfRefreshTokenExistsParams = {
    token: string;
    userId: string;
  };
}
