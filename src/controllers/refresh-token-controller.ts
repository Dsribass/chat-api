import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";
import { ApplicationError, config } from "../common";
import { Common, UseCase } from "../constants";

export class RefreshTokenController {
  async handler(
    request: FastifyRequest<{ Body: RefreshTokenController.Body }>,
    reply: FastifyReply
  ) {
    const { refreshToken } = request.body;

    try {
      const { sub } = verify(refreshToken, config.refresh_token_secret) as {
        sub: string;
      };

      await UseCase.checkIfRefreshTokenExists.execute({
        token: refreshToken,
        userId: sub,
      });

      const user = await UseCase.getUser.execute({ id: sub });
      const accessToken = Common.authenticationHandler.generateAccessToken(user);

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

namespace RefreshTokenController {
  export interface Body {
    refreshToken: string;
  }
}
