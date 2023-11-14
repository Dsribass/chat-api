import dotenv from "dotenv";
import Fastify, { FastifyInstance } from "fastify";
import { prismaClient } from "./constants";
import { applicationRoutes } from "./routes";

const start = async () => {
  dotenv.config();

  const server = Fastify({ logger: true });

  try {
    server.register(applicationRoutes);
    await server.listen({ port: 3000 });
  } catch (err) {
    prismaClient.$disconnect();
    server.log.error(err);
    process.exit(1);
  }
};

start();
