import { FastifyReply, FastifyRequest } from "fastify";
import { UseCase, Common } from "../constants";

export class SignUpController {
  async handler(
    request: FastifyRequest<{ Body: SignUpController.Body }>,
    reply: FastifyReply
  ) {
    const user = await UseCase.signUp.execute(request.body);
    const tokens = Common.authenticationHandler.generateUserToken(user);
    await UseCase.saveRefreshToken.execute({
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
