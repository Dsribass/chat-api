import { FastifySchema } from "fastify";
import { z } from "zod";
import user from "./user-schema-props";

export default {
  body: z.object({
    email: user.email,
    password: user.password,
  }),
} as FastifySchema;
