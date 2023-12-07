import { PrismaClient } from "@prisma/client";
import { ApplicationError } from "../common/errors";
import { User } from "../models/user";
import { Service } from "./service";
import bcrypt from "bcrypt";

export class SignIn implements Service<SignIn.Params, SignIn.Result> {
  constructor(private prismaClient: PrismaClient) {}

  async execute(param: SignIn.Params) {
    const userAlreadyExists = await this.prismaClient.user.findFirst({
      where: { email: param.email },
    });

    if (!userAlreadyExists) {
      throw new ApplicationError({
        message: "Cannot sign in, user not found",
        statusCode: 404,
      });
    }

    const passwordMatch = bcrypt.compareSync(
      param.password,
      userAlreadyExists.password
    );

    if (!passwordMatch) {
      throw new ApplicationError({
        message: "Cannot sign in, password is incorrect",
        statusCode: 400,
      });
    }

    return userAlreadyExists;
  }
}

export namespace SignIn {
  export type Params = {
    email: string;
    password: string;
  };

  export type Result = User;
}
