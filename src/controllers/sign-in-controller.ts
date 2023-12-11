import { FastifyReply, FastifyRequest } from "fastify";
import { AuthenticationHandler } from "../common";
import { SignIn, SaveRefreshToken } from "../services";
import { User } from "../models/user";

export class SignInController {
  constructor(
    private readonly signIn: SignIn,
    private readonly saveRefreshToken: SaveRefreshToken,
    private readonly authenticationHandler: AuthenticationHandler
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(
    request: FastifyRequest<{ Body: SignInController.Body }>,
    reply: FastifyReply
  ) {
    const user = await this.signIn
      .execute(request.body)
      .then((user) => new User({ ...user }));
      
    const tokens = this.authenticationHandler.generateUserToken(user);
    await this.saveRefreshToken.execute({
      token: tokens.refreshToken,
      userId: user.id,
    });

    reply.code(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }
}

namespace SignInController {
  export interface Body {
    email: string;
    password: string;
  }
}
