import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { ApplicationError } from "../common/errors";
import { User } from "../models/user";
import { Service } from "./service";

export class SignUp implements Service<SignUp.Params, SignUp.Result> {
  constructor(private prismaClient: PrismaClient) {}

  async execute(param: SignUp.Params) {
    const userAlreadyExists = await this.prismaClient.user.findFirst({
      where: { email: param.email },
    });

    if (userAlreadyExists) {
      throw new ApplicationError({
        message: "Cannot sign up, email already in use",
        statusCode: 400,
      });
    }

    return await this.prismaClient.user.create({
      data: {
        id: randomUUID(),
        name: param.name,
        email: param.email,
        password: param.password,
      },
    });
  }
}

export namespace SignUp {
  export type Params = {
    name: string;
    email: string;
    password: string;
  };
  export type Result = User;
}
