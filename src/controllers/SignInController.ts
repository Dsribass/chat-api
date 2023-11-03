import { FastifyReply, FastifyRequest } from "fastify";
import { signInUseCase } from "../constants";
import { SignInParams } from "../useCases/SignInUseCase";
import { TokenHandler } from "../common/TokenHandler";

export class SignInController {
  async handler(
    request: FastifyRequest<{ Body: SignInParams }>,
    reply: FastifyReply
  ) {
    const user = await signInUseCase.execute(request.body);

    reply.code(200).send(
      TokenHandler.generateToken({
        user,
        payload: {},
        expiresIn: "180s",
      })
    );
  }
}
