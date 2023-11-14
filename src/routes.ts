import { FastifyInstance } from "fastify";
import { signInUserController, signUpUserController } from "./constants";

const routeInformation = {
  auth: {
    signUp: {
      path: "/auth/signup",
      handler: signUpUserController.handler,
    },
    signIn: {
      path: "/auth/signin",
      handler: signInUserController.handler,
    },
  },
};

async function routes(fastify: FastifyInstance, options: any) {
  authRoutes(fastify, options);
}

function authRoutes(fastify: FastifyInstance, options: any) {
  const auth = routeInformation.auth;
  fastify.post(auth.signUp.path, auth.signUp.handler);
  fastify.post(auth.signIn.path, auth.signIn.handler);
}

export { routes, routeInformation };
