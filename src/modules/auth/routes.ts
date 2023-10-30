import { FastifyInstance } from "fastify";

const BASE_PATH = "/auth";

namespace Auth {
  export async function routes(fastify: FastifyInstance, options: any) {
    fastify.post(`${BASE_PATH}/login`, async (request, reply) => {
      return {
        token: "93i1SDdsaijd2-dsadasdas-dasdada",
        refresh_token: "93i1SDdsaijd2-dsadasdas-dasdada",
      };
    });

    fastify.post(`${BASE_PATH}/logout`, async (request, reply) => {
      return { hello: "world" };
    });
  }
}

export default Auth;
