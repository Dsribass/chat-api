import { FastifySchema } from "fastify";
import { z } from "zod";

export default {
  body: z.object({ id: z.string() }),
} as FastifySchema;
