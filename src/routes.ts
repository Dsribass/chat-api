import { FastifyInstance } from "fastify";
import { signInUserController, signUpUserController } from "./constants";

export async function routes(fastify: FastifyInstance, options: any) {
  fastify.post("/auth/signup", signUpUserController.handler);
  fastify.post("/auth/signin", signInUserController.handler);
}
