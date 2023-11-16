import { FastifySchema } from "fastify";
import { z } from "zod";

export default {
  body: z.object({
    refreshToken: z.string().min(1).max(255),
  }),
} as FastifySchema;
