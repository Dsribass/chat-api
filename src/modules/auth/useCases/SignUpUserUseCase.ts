import { randomUUID } from "crypto";
import { UseCase } from "../../core/UseCase";
import { prismaClient } from "../../core/injection";

type SignUpUserParams = {
  name: string;
  email: string;
  password: string;
};

type SignUpUserResponse = {
  id: string;
  name: string;
  email: string;
};

class SignUpUserUseCase
  implements UseCase<SignUpUserParams, SignUpUserResponse>
{
  async execute(param: SignUpUserParams): Promise<SignUpUserResponse> {
    const userAlreadyExists = await prismaClient.user.findFirst({
      where: {
        email: param.email,
      },
    });

    if (userAlreadyExists) {
      throw new Error("User already exists");
    }

    return await prismaClient.user.create({
      data: {
        id: randomUUID(),
        name: param.name,
        email: param.email,
        password: param.password,
      },
    });
  }
}

export { SignUpUserUseCase, SignUpUserParams, SignUpUserResponse };
