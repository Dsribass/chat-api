import { FastifyInstance, HookHandlerDoneFunction } from "fastify";
import { ChatServer } from "./common/socket-io/namespace/chat-server";
import {
  makeRefreshTokenController,
  makeSignInController,
  makeSignUpController,
} from "./factory";
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
  chat: (
    fastify: FastifyInstance,
    options: any,
    done: HookHandlerDoneFunction
  ) => {
    const chat: ChatServer = fastify.io.of("/chat");

    chat.on("connection", (socket) => {});

    done();
  },
};

async function applicationRoutes(instance: FastifyInstance, options: any) {
  instance.register(routes.auth, { prefix: "/auth" });
  instance.register(routes.chat, { prefix: "/chat" });
}

export { applicationRoutes };
