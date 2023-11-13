import { PrismaClient } from "@prisma/client";
import { SignInController } from "./controllers/SignInController";
import { SignUpUserController } from "./controllers/SignUpController";
import { SignInUseCase } from "./useCases/SignInUseCase";
import { SignUpUseCase } from "./useCases/SignUpUseCase";
import { SaveUserRefreshTokenUseCase } from "./useCases/SaveUserRefreshTokenUseCase";
import { AuthenticationHandler } from "./common/AuthenticationHandler";

export const prismaClient = new PrismaClient();

export const saveUserRefreshTokenUseCase = new SaveUserRefreshTokenUseCase();

export const signUpUserUseCase = new SignUpUseCase();

export const signUpUserController = new SignUpUserController();

export const signInUseCase = new SignInUseCase();

export const signInUserController = new SignInController();

export const authenticationHandler = new AuthenticationHandler();
