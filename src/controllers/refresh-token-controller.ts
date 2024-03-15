import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";
import { ApplicationError, AuthenticationHandler } from "../common";
import { User } from "../models/user";
import { CheckIfRefreshTokenExists, GetUserById } from "../services";

export class RefreshTokenController {
  constructor(
    private readonly checkIfRefreshTokenExists: CheckIfRefreshTokenExists,
    private readonly getUser: GetUserById,
    private readonly authenticationHandler: AuthenticationHandler
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(
    request: FastifyRequest<{ Body: RefreshTokenController.Body }>,
    reply: FastifyReply
  ) {
    const { refreshToken } = request.body;

    try {
      const { sub } = verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      ) as {
        sub: string;
      };

      await this.checkIfRefreshTokenExists.execute({
        token: refreshToken,
        userId: sub,
      });

      const user = await this.getUser
        .execute({ id: sub })
        .then((user) => new User({ ...user }));
      const accessToken = this.authenticationHandler.generateAccessToken(user);

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
