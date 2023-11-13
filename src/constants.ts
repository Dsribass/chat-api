import { PrismaClient } from "@prisma/client";
import { AuthenticationHandler } from "./common/AuthenticationHandler";
import { SignInController } from "./controllers/SignInController";
import { SignUpUserController } from "./controllers/SignUpController";
import { SaveRefreshTokenUseCase } from "./useCases/SaveRefreshTokenUseCase";
import { SignInUseCase } from "./useCases/SignInUseCase";
import { SignUpUseCase } from "./useCases/SignUpUseCase";

export const prismaClient = new PrismaClient();

export const saveRefreshTokenUseCase = new SaveRefreshTokenUseCase();

export const signUpUserUseCase = new SignUpUseCase();

export const signUpUserController = new SignUpUserController();

export const signInUseCase = new SignInUseCase();

export const signInUserController = new SignInController();

export const authenticationHandler = new AuthenticationHandler();
