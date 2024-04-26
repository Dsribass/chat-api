import { PrismaClient } from "@prisma/client";
import { User } from "../models/user";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { ApplicationError } from "../common";

export interface IUserService {
  createUser: (
    params: IUserService.CreateUserParams
  ) => Promise<IUserService.CreateUserResult>;
  authenticate: (
    params: IUserService.AuthenticateParams
  ) => Promise<IUserService.AuthenticateResult>;
  getUserById: (
    params: IUserService.GetUserByIdParams
  ) => Promise<IUserService.GetUserByIdResult>;
  getUserByEmail: (
    params: IUserService.GetUserByEmailParams
  ) => Promise<IUserService.GetUserByEmailResult>;
}

export class UserService implements IUserService {
  constructor(private prismaClient: PrismaClient) {}

  async createUser(param: IUserService.CreateUserParams) {
    const userAlreadyExists = await this.prismaClient.user.findFirst({
      where: { email: param.email },
    });

    if (userAlreadyExists) {
      throw new ApplicationError({
        message: "Cannot sign up, email already in use",
        statusCode: 400,
      });
    }

    const hashedPassword = bcrypt.hashSync(param.password, 10);

    return await this.prismaClient.user
      .create({
        data: {
          id: randomUUID(),
          name: param.name,
          email: param.email,
          password: hashedPassword,
        },
      })
      .then((user) => new User({ ...user }));
  }

  async authenticate(param: IUserService.AuthenticateParams) {
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

    return new User({ ...userAlreadyExists });
  }

  async getUserById(param: IUserService.GetUserByIdParams) {
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

  async getUserByEmail(param: IUserService.GetUserByEmailParams) {
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

namespace IUserService {
  export type CreateUserParams = {
    name: string;
    email: string;
    password: string;
  };
  export type CreateUserResult = User;

  export type AuthenticateParams = {
    email: string;
    password: string;
  };

  export type AuthenticateResult = User;

  export type GetUserByIdParams = {
    id: string;
  };

  export type GetUserByIdResult = User;

  export type GetUserByEmailParams = {
    email: string;
  };

  export type GetUserByEmailResult = User;
}
