import { FastifyInstance, HookHandlerDoneFunction } from "fastify";
import { makeRefreshTokenController, makeSignInController, makeSignUpController } from "./factory";
import { ensureClientIsAuthorized } from "./middlewares/ensure-client-is-authorized";
import refreshTokenSchema from "./schemas/refresh-token-schema";
import signInSchema from "./schemas/sign-in-schema";
import signUpSchema from "./schemas/sign-up-schema";

const routes = {
  auth: (
    fastify: FastifyInstance,
    options: any,
    done: HookHandlerDoneFunction
  ) => {
    fastify.post("/sign-in", {
      schema: signInSchema,
      handler: makeSignInController().handler,
    });

    fastify.post("/sign-up", {
      schema: signUpSchema,
      handler: makeSignUpController().handler,
    });

    fastify.post("/refresh-token", {
      schema: refreshTokenSchema,
      handler: makeRefreshTokenController().handler,
    });

    done();
  },
  home: (
    fastify: FastifyInstance,
    options: any,
    done: HookHandlerDoneFunction
  ) => {
    fastify.addHook("preValidation", ensureClientIsAuthorized);

    fastify.get("/", async (request, reply) => {
      return { hello: "world" };
    });

    done();
  },
};

async function applicationRoutes(instance: FastifyInstance, options: any) {
  instance.register(routes.auth, { prefix: "/auth" });
  instance.register(routes.home);
}

export { applicationRoutes };
