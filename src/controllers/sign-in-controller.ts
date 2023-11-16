import { FastifyReply, FastifyRequest } from "fastify";
import { Common, Service } from "../constants";

export class SignInController {
  async handler(
    request: FastifyRequest<{ Body: SignInController.Body }>,
    reply: FastifyReply
  ) {
    const user = await Service.signIn.execute(request.body);
    const tokens = Common.authenticationHandler.generateUserToken(user);
    await Service.saveRefreshToken.execute({
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