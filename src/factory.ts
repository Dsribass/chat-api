import { PrismaClient } from "@prisma/client";
import * as common from "./common";
import * as controllers from "./controllers";
import * as service from "./services";

const prismaClient = new PrismaClient();

const authenticationHandler = new common.AuthenticationHandler();

export const makeCheckIfRefreshTokenExists = () => {
  return new service.CheckIfRefreshTokenExists(prismaClient);
};

export const makeGetUser = () => {
  return new service.GetUser(prismaClient);
};

export const makeSaveRefreshToken = () => {
  return new service.SaveRefreshToken(prismaClient);
};

export const makeSignIn = () => {
  return new service.SignIn(prismaClient);
};

export const makeSignUp = () => {
  return new service.SignUp(prismaClient);
};

export const makeRefreshTokenController = () => {
  return new controllers.RefreshTokenController(
    makeCheckIfRefreshTokenExists(),
    makeGetUser(),
    authenticationHandler
  );
};

export const makeSignInController = () => {
  return new controllers.SignInController(
    makeSignIn(),
    makeSaveRefreshToken(),
    authenticationHandler
  );
};

export const makeSignUpController = () => {
  return new controllers.SignUpController(
    makeSignUp(),
    makeSaveRefreshToken(),
    authenticationHandler
  );
};
