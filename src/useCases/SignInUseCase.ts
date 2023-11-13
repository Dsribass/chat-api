import { ApplicationError } from "../common/errors";
import { prismaClient } from "../constants";
import { User } from "../models/User";
import { UseCase } from "./UseCase";

type SignInParams = {
  email: string;
  password: string;
};

class SignInUseCase implements UseCase<SignInParams, User> {
  async execute(param: SignInParams): Promise<User> {
    const userAlreadyExists = await prismaClient.user.findFirst({
      where: { email: param.email },
    });

    if (!userAlreadyExists) {
      throw new ApplicationError({
        message: "Cannot sign in, user not found",
        statusCode: 404,
      });
    }

    const passwordMatch = userAlreadyExists.password === param.password;

    if (!passwordMatch) {
      throw new ApplicationError({
        message: "Cannot sign in, password is incorrect",
        statusCode: 400,
      });
    }

    return userAlreadyExists;
  }
}

export { SignInParams, SignInUseCase };
