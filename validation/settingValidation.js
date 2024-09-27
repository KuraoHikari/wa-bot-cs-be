import { z } from "zod";

export const settingSchema = z.object({
 body: z.object({
  stopAiResponse: z.boolean(),
 }),
});
