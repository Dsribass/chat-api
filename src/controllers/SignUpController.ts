import { FastifyReply, FastifyRequest } from "fastify";
import { signUpUserUseCase } from "../constants";
import { SignUpParams } from "../useCases/SignUpUseCase";
import { TokenHandler } from "../common/TokenHandler";

export class SignUpUserController {
  async handler(
    request: FastifyRequest<{ Body: SignUpParams }>,
    reply: FastifyReply
  ) {
    const user = await signUpUserUseCase.execute(request.body);

    reply.code(201).send(
      TokenHandler.generateToken({
        user,
        payload: {},
        expiresIn: "180s",
      })
    );
  }
}
