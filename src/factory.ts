import { PrismaClient } from "@prisma/client";
import * as common from "./common";
import * as controllers from "./controllers";
import * as service from "./services";

const prismaClient = new PrismaClient();

const authenticationHandler = new common.AuthenticationHandler();

const makeChannelService = () => {
  return new service.ChannelService(prismaClient);
};

const makeTokenService = () => {
  return new service.TokenService(prismaClient);
};

const makeUserService = () => {
  return new service.UserService(prismaClient);
};

export const makeRefreshTokenController = () => {
  return new controllers.RefreshTokenController(
    makeUserService(),
    makeTokenService(),
    authenticationHandler
  );
};

export const makeSignInController = () => {
  return new controllers.SignInController(
    makeUserService(),
    makeTokenService(),
    authenticationHandler
  );
};

export const makeSignUpController = () => {
  return new controllers.SignUpController(
    makeUserService(),
    makeTokenService(),
    authenticationHandler
  );
};

export const makeCreateChannelController = () => {
  return new controllers.CreateChannelController(
    makeChannelService(),
    makeUserService()
  );
};

export const makeDeleteChannelController = () => {
  return new controllers.DeleteChannelController(makeChannelService());
};

export const makeUpdateChannelController = () => {
  return new controllers.UpdateChannelController(makeChannelService());
};

export const makeGetChannelController = () => {
  return new controllers.GetChannelController(makeChannelService());
};