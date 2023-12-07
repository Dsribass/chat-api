import { FastifySchema } from "fastify";
import { z } from "zod";

export default {
  body: z.object({
    refreshToken: z.string(),
  }),
} as FastifySchema;
