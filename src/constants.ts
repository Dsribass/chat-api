import { PrismaClient } from "@prisma/client";
import { AuthenticationHandler } from "./common/AuthenticationHandler";
import { RefreshTokenController } from "./controllers/RefreshTokenController";
import { SignInController } from "./controllers/SignInController";
import { SignUpUserController } from "./controllers/SignUpController";
import { SaveRefreshTokenUseCase } from "./useCases/SaveRefreshTokenUseCase";
import { SignInUseCase } from "./useCases/SignInUseCase";
import { SignUpUseCase } from "./useCases/SignUpUseCase";
import { CheckIfRefreshTokenExistsUseCase } from "./useCases/CheckIfRefreshTokenExistsUseCase";
import { GetUserUseCase } from "./useCases/GetUserUseCase";

export const prismaClient = new PrismaClient();

export const saveRefreshTokenUseCase = new SaveRefreshTokenUseCase();

export const signUpUserUseCase = new SignUpUseCase();

export const signUpUserController = new SignUpUserController();

export const signInUseCase = new SignInUseCase();

export const signInUserController = new SignInController();

export const authenticationHandler = new AuthenticationHandler();

export const refreshTokenController = new RefreshTokenController();

export const checkIfRefreshTokenExistsUseCase = new CheckIfRefreshTokenExistsUseCase();

export const getUserUseCase = new GetUserUseCase();