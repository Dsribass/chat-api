import { FastifyReply, FastifyRequest } from "fastify";
import {
  authenticationHandler,
  checkIfRefreshTokenExistsUseCase,
  getUserUseCase,
} from "../constants";
import { verify } from "jsonwebtoken";
import { config } from "../common/config";
import { ApplicationError } from "../common/errors";

interface IRefreshTokenBody {
  refreshToken: string;
}

export class RefreshTokenController {
  async handler(
    request: FastifyRequest<{ Body: IRefreshTokenBody }>,
    reply: FastifyReply
  ) {
    const { refreshToken } = request.body;

    try {
      const { sub } = verify(refreshToken, config.refresh_token_secret) as {
        sub: string;
      };

      await checkIfRefreshTokenExistsUseCase.execute({
        token: refreshToken,
        userId: sub,
      });

      const user = await getUserUseCase.execute({ id: sub });
      const accessToken = authenticationHandler.generateAccessToken(user);

      reply.send({ accessToken: accessToken });
    } catch (e) {
      if (e instanceof ApplicationError) {
        throw e;
      }

      throw new ApplicationError({
        message: "Refresh token invalid",
        statusCode: 401,
      });
    }
  }
}
