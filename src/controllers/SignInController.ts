import { FastifyReply, FastifyRequest } from "fastify";
import {
  authenticationHandler,
  saveRefreshTokenUseCase,
  signInUseCase,
} from "../constants";
import { SignInParams } from "../useCases/SignInUseCase";

export class SignInController {
  async handler(
    request: FastifyRequest<{ Body: SignInParams }>,
    reply: FastifyReply
  ) {
    const user = await signInUseCase.execute(request.body);
    const tokens = await authenticationHandler.generateUserToken(user);
    await saveRefreshTokenUseCase.execute({
      token: tokens.refreshToken,
      userId: user.id,
    });

    reply.code(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }
}
