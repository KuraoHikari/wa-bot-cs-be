import { z } from "zod";

export const settingSchema = z.object({
 body: z.object({
  stopAiResponse: z.boolean(),
 }),
});

export const updatePromtSchema = z.object({
 body: z.object({
  prompt: z.string().optional(),
  gptModel: z.enum(["chatgpt-4o-latest", "gpt-3.5-turbo"]).optional(),
 }),
});
