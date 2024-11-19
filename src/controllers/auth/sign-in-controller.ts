import { FastifyReply, FastifyRequest } from "fastify";
import { AuthenticationHandler } from "../../common";
import { User } from "../../models/user";
import { ITokenService, IUserService } from "../../services";

export class SignInController {
  constructor(
    private readonly userService: IUserService,
    private readonly tokenService: ITokenService,
    private readonly authenticationHandler: AuthenticationHandler
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(
    request: FastifyRequest<{ Body: SignInController.Body }>,
    reply: FastifyReply
  ) {
    const user = await this.userService
      .authenticate(request.body);

    const tokens = this.authenticationHandler.generateUserToken(user);
    await this.tokenService.persistRefreshToken({
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
