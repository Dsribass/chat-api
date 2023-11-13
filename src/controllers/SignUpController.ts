import { FastifyReply, FastifyRequest } from "fastify";
import {
  authenticationHandler,
  saveUserRefreshTokenUseCase,
  signUpUserUseCase,
} from "../constants";
import { SignUpParams } from "../useCases/SignUpUseCase";

export class SignUpUserController {
  async handler(
    request: FastifyRequest<{ Body: SignUpParams }>,
    reply: FastifyReply
  ) {
    const user = await signUpUserUseCase.execute(request.body);
    const tokens = await authenticationHandler.generateUserToken(user);
    await saveUserRefreshTokenUseCase.execute(tokens.refreshToken);

    reply.code(201).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken.token,
    });
  }
}
