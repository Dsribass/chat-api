import { PrismaClient } from "@prisma/client";
import { ApplicationError } from "../common/errors";
import { User } from "../models/user";
import { Service } from "./service";

export class GetUser implements Service<GetUser.Params, GetUser.Result> {
  constructor(private prismaClient: PrismaClient) {}

  async execute(param: GetUser.Params) {
    const user = await this.prismaClient.user.findFirst({
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

export namespace GetUser {
  export type Params = {
    id: string;
  };

  export type Result = User;
}
