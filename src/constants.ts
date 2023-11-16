import { PrismaClient } from "@prisma/client";
import * as common from "./common";
import * as controllers from "./controllers";
import * as service from "./services";
export namespace Common {
  export const prismaClient = new PrismaClient();
  export const authenticationHandler = new common.AuthenticationHandler();
}
export namespace Service {
  export const signIn = new service.SignIn(Common.prismaClient);

  export const signUp = new service.SignUp(Common.prismaClient);

  export const checkIfRefreshTokenExists = new service.CheckIfRefreshTokenExists(
    Common.prismaClient
  );

  export const getUser = new service.GetUser(Common.prismaClient);

  export const saveRefreshToken = new service.SaveRefreshToken(Common.prismaClient);
}

export namespace Controller {
  export const signUp = new controllers.SignUpController();

  export const signIn = new controllers.SignInController();

  export const refreshToken = new controllers.RefreshTokenController();
}
