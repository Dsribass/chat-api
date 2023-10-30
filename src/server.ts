import Fastify, { FastifyInstance } from "fastify";
import Auth from "./modules/auth/routes";

const start = async () => {
  const server = Fastify({ logger: true });

  try {
    registerRoutes(server);

    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

function registerRoutes(server: FastifyInstance) {
  server.register(Auth.routes);
}

start();
