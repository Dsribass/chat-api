import { PrismaClient } from "@prisma/client";
import { ApplicationError } from "../common/errors";
import { User } from "../models/user";
import { Service } from "./service";

export class GetUserById implements Service<GetUserById.Params, GetUserById.Result> {
  constructor(private prismaClient: PrismaClient) {}

  async execute(param: GetUserById.Params) {
    const user = await this.prismaClient.user.findFirst({
      where: { id: param.id },
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

export namespace GetUserById {
  export type Params = {
    id: string;
  };

  export type Result = User;
}
