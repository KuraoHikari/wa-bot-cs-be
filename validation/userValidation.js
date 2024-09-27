import { z } from "zod";

export const updateUserSchema = z.object({
 body: z.object({
  phoneNumber: z.string(),
 }),
});
