import { PrismaClient } from "@prisma/client";
import { ApplicationError } from "../common/errors";
import { User } from "../models/user";
import { Service } from "./service";

export class GetUserByEmail implements Service<GetUserByEmail.Params, GetUserByEmail.Result> {
  constructor(private prismaClient: PrismaClient) {}

  async execute(param: GetUserByEmail.Params) {
    const user = await this.prismaClient.user.findFirst({
      where: { email: param.email },
    });

    if (!user) {
      throw new ApplicationError({
        message: "User not found",
        statusCode: 404,
      });
    }

    return new User({ ...user });
  }
}

export namespace GetUserByEmail {
  export type Params = {
    email: string;
  };

  export type Result = User;
}
