import dotenv from "dotenv";
import Fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { ZodError } from "zod";
import socketIoPlugin from "./common/socket-io-plugin";
import { httpRoutes } from "./routes";
import { ChatNamespace } from "./sockets/namespaces/chat";
import { SocketServer } from "./sockets/server";
import { makeAuthenticationHandler } from "./factory";

const start = async () => {
  dotenv.config();

  const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
  const socketServer = new SocketServer([
    new ChatNamespace(makeAuthenticationHandler()),
  ]);

  try {
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.setErrorHandler(errorHandler);
    app.register(socketIoPlugin);

    await app.register(httpRoutes);
    await app.listen({ port: process.env.PORT }).then(() => {
      socketServer.setup(app.io);
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ZodError) {
    reply.status(400).send({
      statusCode: 400,
      error: "Bad Request",
      message: "Validation error",
      issues: error.issues,
    });
    return;
  }

  reply.send(error);
}

start();
