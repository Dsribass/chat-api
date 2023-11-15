import { FastifyReply, FastifyRequest } from "fastify";
import {
  authenticationHandler,
  saveRefreshTokenUseCase,
  signUpUserUseCase,
} from "../constants";
import { SignUpParams } from "../useCases/SignUpUseCase";

export class SignUpUserController {
  async handler(
    request: FastifyRequest<{ Body: SignUpParams }>,
    reply: FastifyReply
  ) {
    const user = await signUpUserUseCase.execute(request.body);
    const tokens = authenticationHandler.generateUserToken(user);
    await saveRefreshTokenUseCase.execute({
      token: tokens.refreshToken,
      userId: user.id,
    });

    reply.code(201).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }
}
