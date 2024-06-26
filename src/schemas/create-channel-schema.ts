import { FastifySchema } from "fastify";
import { z } from "zod";
import channelSchemaProps from "./channel-schema-props";

export default {
  body: z.object({
    type: z.enum(["group", "direct"]),
    ...channelSchemaProps,
  }),
} as FastifySchema;
