import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { Server, ServerOptions } from "socket.io";

const socketIoPlugin: FastifyPluginAsync<Partial<ServerOptions>> = fp(
  async function (fastify, opts) {
    fastify.decorate("io", new Server(fastify.server, opts));
    fastify.addHook("onClose", (fastify: FastifyInstance, done) => {
      (fastify as any).io.close();
      done();
    });
  },
  { fastify: ">=4.x.x", name: "socket-io-plugin" }
);

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }
}

export default socketIoPlugin;
