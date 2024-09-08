import { FastifyInstance, HookHandlerDoneFunction } from "fastify";
import {
  makeAuthenticationHandler,
  makeCreateChannelController,
  makeDeleteChannelController,
  makeGetChannelController,
  makeRefreshTokenController,
  makeSignInController,
  makeSignUpController,
  makeUpdateChannelController,
} from "./factory";
import { ensureClientIsAuthorized } from "./middlewares/ensure-client-is-authorized";
import createChannelSchema from "./schemas/create-channel-schema";
import deleteChannelSchema from "./schemas/delete-channel-schema";
import refreshTokenSchema from "./schemas/refresh-token-schema";
import signInSchema from "./schemas/sign-in-schema";
import signUpSchema from "./schemas/sign-up-schema";
import updateChannelSchema from "./schemas/update-channel-schema";

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
  chat: (
    fastify: FastifyInstance,
    options: any,
    done: HookHandlerDoneFunction
  ) => {
    fastify.addHook("preValidation", (request, reply, done) =>
      ensureClientIsAuthorized({
        authenticationHandler: makeAuthenticationHandler(),
        request,
        reply,
        done,
      })
    );

    fastify.get("/channels/:id", {
      handler: makeGetChannelController().handler,
    });

    fastify.post("/channels", {
      schema: createChannelSchema,
      handler: makeCreateChannelController().handler,
    });

    fastify.delete("/channels", {
      schema: deleteChannelSchema,
      handler: makeDeleteChannelController().handler,
    });

    fastify.put("/channels", {
      schema: updateChannelSchema,
      handler: makeUpdateChannelController().handler,
    });

    done();
  },
};

async function httpRoutes(instance: FastifyInstance, options: any) {
  instance.register(routes.auth, { prefix: "/auth" });
  instance.register(routes.chat, { prefix: "/chat" });
}

export { httpRoutes };
