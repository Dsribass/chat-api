import { PrismaClient } from "@prisma/client";
import * as common from "./common";
import * as controllers from "./controllers";
import * as service from "./services";

const prismaClient = new PrismaClient();

const authenticationHandler = new common.AuthenticationHandler();

export function makeCheckIfRefreshTokenExists() {
  return new service.CheckIfRefreshTokenExists(prismaClient);
}

export function makeGetUser() {
  return new service.GetUser(prismaClient);
}

export function makeSaveRefreshToken() {
  return new service.SaveRefreshToken(prismaClient);
}

export function makeSignIn() {
  return new service.SignIn(prismaClient);
}

export function makeSignUp() {
  return new service.SignUp(prismaClient);
}

export function makeRefreshTokenController() {
  return new controllers.RefreshTokenController(
    makeCheckIfRefreshTokenExists(),
    makeGetUser(),
    authenticationHandler
  );
}

export function makeSignInController() {
  return new controllers.SignInController(
    makeSignIn(),
    makeSaveRefreshToken(),
    authenticationHandler
  );
}

export function makeSignUpController() {
  return new controllers.SignUpController(
    makeSignUp(),
    makeSaveRefreshToken(),
    authenticationHandler
  );
}
