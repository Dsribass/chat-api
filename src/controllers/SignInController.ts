import { FastifyReply, FastifyRequest } from "fastify";
import {
  authenticationHandler,
  saveRefreshTokenUseCase,
  signInUseCase,
} from "../constants";

interface ISignInBody {
  email: string;
  password: string;
}

export class SignInController {
  async handler(
    request: FastifyRequest<{ Body: ISignInBody }>,
    reply: FastifyReply
  ) {
    const user = await signInUseCase.execute(request.body);
    const tokens = authenticationHandler.generateUserToken(user);
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
