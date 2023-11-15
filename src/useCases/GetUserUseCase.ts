import { ApplicationError } from "../common/errors";
import { prismaClient } from "../constants";
import { User } from "../models/User";
import { UseCase } from "./UseCase";

type GetUserParams = {
  id: string;
};

class GetUserUseCase implements UseCase<GetUserParams, User> {
  async execute(param: GetUserParams): Promise<User> {
    const user = await prismaClient.user.findFirst({
      where: { id: param.id },
    });

    if (!user) {
      throw new ApplicationError({
        message: "User not found",
        statusCode: 404,
      });
    }

    return user;
  }
}

export { GetUserUseCase };
