import { z } from "zod";
import userSchemaProps from "./user-schema-props";

export default {
  name: z.string().min(1).optional().nullable(),
  members: z
    .array(userSchemaProps.email)
    .min(2)
    .refine(
      (items) => {
        const uniqueValues = new Set(items);
        return items.length === uniqueValues.size;
      },
      { message: "Members list must have unique values" }
    ),
};
