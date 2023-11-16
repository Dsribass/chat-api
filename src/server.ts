import dotenv from "dotenv";
import Fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { applicationRoutes } from "./routes";
import env from "./common/env";
import { Common } from "./constants";
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { ZodError } from "zod";

const start = async () => {
  dotenv.config();

  const server = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

  try {
    server.setValidatorCompiler(validatorCompiler);
    server.setSerializerCompiler(serializerCompiler);
    server.setErrorHandler(errorHandler);
    await server.register(applicationRoutes);
    await server.listen({ port: env.port });
  } catch (err) {
    Common.prismaClient.$disconnect();
    server.log.error(err);
    process.exit(1);
  }
};

function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ZodError) {
    reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation error',
      issues: error.issues,
    });
    return;
  }

  reply.send(error);
}

start();
