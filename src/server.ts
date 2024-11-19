import dotenv from "dotenv";
import Fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { ZodError } from "zod";
import { ApplicationError } from "./common";
import socketIoPlugin from "./common/socket-io-plugin";
import { makeAuthenticationHandler } from "./factory";
import { httpRoutes } from "./routes";
import { ChatNamespace } from "./sockets/namespaces/chat";
import { SocketServer } from "./sockets/server";
import { STATUS_CODES } from "http";

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
      inputIssues: error.flatten().fieldErrors,
    });
    return;
  }

  if (error instanceof ApplicationError) {
    reply.status(error.statusCode).send({
      type: error.type,
      statusCode: error.statusCode,
      error: STATUS_CODES[error.statusCode],
      message: error.message,
    });
    return;
  }

  reply.send(error);
}

start();
