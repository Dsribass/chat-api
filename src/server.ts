import dotenv from "dotenv";
import Fastify, { FastifyInstance } from "fastify";
import { prismaClient } from "./constants";
import { routeInformation, routes } from "./routes";
import { ensureClientIsAuthorized } from "./middlewares/ensureClientIsAuthorized";

const start = async () => {
  dotenv.config();

  const server = Fastify({ logger: true });

  try {
    server.addHook("onRequest", ensureClientIsAuthorized);

    server.register(routes);

    await server.listen({ port: 3000 });
  } catch (err) {
    prismaClient.$disconnect();
    server.log.error(err);
    process.exit(1);
  }
};

start();
