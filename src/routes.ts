import { FastifyInstance, HookHandlerDoneFunction } from "fastify";
import { ChatServer } from "./common/socket-io/namespace/chat-server";
import {
  makeCreateChannelController,
  makeDeleteChannelController,
  makeRefreshTokenController,
  makeSignInController,
  makeSignUpController,
  makeUpdateChannelController,
} from "./factory";
import refreshTokenSchema from "./schemas/refresh-token-schema";
import signInSchema from "./schemas/sign-in-schema";
import signUpSchema from "./schemas/sign-up-schema";
import { ensureClientIsAuthorized } from "./middlewares/ensure-client-is-authorized";
import createChannelSchema from "./schemas/create-channel-schema";
import { z } from "zod";
import deleteChannelSchema from "./schemas/delete-channel-schema";
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
    const chatIO: ChatServer = fastify.io.of("/chat");
    fastify.addHook("preValidation", ensureClientIsAuthorized);

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

    chatIO.on("connection", (socket) => {});

    done();
  },
};

async function applicationRoutes(instance: FastifyInstance, options: any) {
  instance.register(routes.auth, { prefix: "/auth" });
  instance.register(routes.chat, { prefix: "/chat" });
}

export { applicationRoutes };
