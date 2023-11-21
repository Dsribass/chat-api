import { FastifyReply, FastifyRequest } from "fastify";
import { AuthenticationHandler } from "../common";
import { SignUp, SaveRefreshToken } from "../services";

export class SignUpController {
  constructor(
    private readonly signUp: SignUp,
    private readonly saveRefreshToken: SaveRefreshToken,
    private readonly authenticationHandler: AuthenticationHandler
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(
    request: FastifyRequest<{ Body: SignUpController.Body }>,
    reply: FastifyReply
  ) {
    const user = await this.signUp.execute(request.body);
    const tokens = this.authenticationHandler.generateUserToken(user);
    await this.saveRefreshToken.execute({
      token: tokens.refreshToken,
      userId: user.id,
    });

    reply.code(201).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }
}

namespace SignUpController {
  export interface Body {
    name: string;
    email: string;
    password: string;
  }
}
