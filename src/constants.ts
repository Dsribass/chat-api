import { PrismaClient } from "@prisma/client";
import * as common from "./common";
import * as controllers from "./controllers";
import * as uc from "./useCases";

export namespace UseCase {
  export const signIn = new uc.SignIn(Common.prismaClient);

  export const signUp = new uc.SignUp(Common.prismaClient);

  export const checkIfRefreshTokenExists = new uc.CheckIfRefreshTokenExists(
    Common.prismaClient
  );

  export const getUser = new uc.GetUser(Common.prismaClient);
  export const saveRefreshToken = new uc.SaveRefreshToken(Common.prismaClient);
}

export namespace Common {
  export const prismaClient = new PrismaClient();
  export const authenticationHandler = new common.AuthenticationHandler();
}

export namespace Controller {
  export const signUp = new controllers.SignUpController();

  export const signIn = new controllers.SignInController();

  export const refreshToken = new controllers.RefreshTokenController();
}
