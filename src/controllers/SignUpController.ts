import { FastifyReply, FastifyRequest } from "fastify";
import {
  authenticationHandler,
  saveRefreshTokenUseCase,
  signUpUserUseCase,
} from "../constants";

interface ISignUpUserBody {
  name: string;
  email: string;
  password: string;
}

export class SignUpUserController {
  async handler(
    request: FastifyRequest<{ Body: ISignUpUserBody }>,
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
