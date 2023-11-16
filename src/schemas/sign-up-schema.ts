import { FastifySchema } from "fastify";
import { z } from "zod";
import user from "./user-schema-props";

export default {
  body: z.object({
    name: user.name,
    email: user.email,
    password: user.password,
  }),
} as FastifySchema;
