import { FastifyInstance, HookHandlerDoneFunction } from "fastify";
import { signInUserController, signUpUserController } from "./constants";
import { ensureClientIsAuthorized } from "./middlewares/ensureClientIsAuthorized";

const routes = {
  auth: (
    fastify: FastifyInstance,
    options: any,
    done: HookHandlerDoneFunction
  ) => {
    fastify.post("/sign-in", signInUserController.handler);
    fastify.post("/sign-up", signUpUserController.handler);

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
