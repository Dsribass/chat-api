import { randomUUID } from "crypto";
import { ApplicationError } from "../common/errors";
import { prismaClient } from "../constants";
import { User } from "../models/User";
import { UseCase } from "./UseCase";

type SignUpParams = {
  name: string;
  email: string;
  password: string;
};

class SignUpUseCase implements UseCase<SignUpParams, User> {
  async execute(param: SignUpParams): Promise<User> {
    const userAlreadyExists = await prismaClient.user.findFirst({
      where: { email: param.email },
    });

    if (userAlreadyExists) {
      throw new ApplicationError({
        message: "Cannot sign up, email already in use",
        statusCode: 400,
      });
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

export { SignUpParams, SignUpUseCase };
