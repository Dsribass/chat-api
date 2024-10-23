import { z } from "zod";

export default {
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string()
    .min(8)
    .max(255)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, { message: "Password must contain at least one letter and one number" }),
};
