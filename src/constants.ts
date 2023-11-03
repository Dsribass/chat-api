import { PrismaClient } from "@prisma/client";
import { SignInController } from "./controllers/SignInController";
import { SignUpUserController } from "./controllers/SignUpController";
import { SignInUseCase } from "./useCases/SignInUseCase";
import { SignUpUseCase } from "./useCases/SignUpUseCase";

export const prismaClient = new PrismaClient();

export const signUpUserUseCase = new SignUpUseCase();

export const signUpUserController = new SignUpUserController();

export const signInUseCase = new SignInUseCase();

export const signInUserController = new SignInController();
