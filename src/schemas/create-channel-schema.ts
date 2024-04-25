import { FastifySchema } from "fastify";
import { z } from "zod";
import userSchemaProps from "./user-schema-props";

export default {
  body: z.object({
    type: z.enum(["group", "direct"]),
    name: z.string().min(1).optional().nullable(),
    members: z.array(userSchemaProps.email).min(2),
  }),
} as FastifySchema;
