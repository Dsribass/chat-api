import { FastifySchema } from "fastify";
import { z } from "zod";
import channelSchemaProps from "./channel-schema-props";

export default {
  body: z.object({
    id: z.string(),
    name: channelSchemaProps.name,
    members: channelSchemaProps.members.optional(),
  }),
} as FastifySchema;
