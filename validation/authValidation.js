import { z } from "zod";

export const registrationSchema = z.object({
 body: z.object({
  email: z.string().email(),
  password: z.string().min(8),
  phoneNumber: z.string(),
 }),
});

export const loginSchema = z.object({
 body: z.object({
  email: z.string().email(),
  password: z.string().min(8),
 }),
});
