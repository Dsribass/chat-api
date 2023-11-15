import { FastifyInstance, HookHandlerDoneFunction } from "fastify";
import { Controller } from "./constants";
import { ensureClientIsAuthorized } from "./middlewares/ensureClientIsAuthorized";

const routes = {
  auth: (
    fastify: FastifyInstance,
    options: any,
    done: HookHandlerDoneFunction
  ) => {
    fastify.post("/sign-in", Controller.signIn.handler);
    fastify.post("/sign-up", Controller.signUp.handler);
    fastify.post("/refresh-token", Controller.refreshToken.handler);

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
