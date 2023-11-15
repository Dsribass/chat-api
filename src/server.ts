import dotenv from "dotenv";
import Fastify from "fastify";
import { applicationRoutes } from "./routes";
import env from "./common/env";
import { Common } from "./constants";

const start = async () => {
  dotenv.config();

  const server = Fastify({ logger: true });

  try {
    server.register(applicationRoutes);
    await server.listen({ port: env.port });
  } catch (err) {
    Common.prismaClient.$disconnect();
    server.log.error(err);
    process.exit(1);
  }
};

start();
