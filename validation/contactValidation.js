import { number, z } from "zod";

const paginationSchema = z.object({
 page: z.string().optional(),
 limit: z.string().optional(),
});

export const getContactsQuerySchema = z.object({
 query: paginationSchema,
 body: z.object({
  number: z.string().optional(),
 }),
});

export const getContactLimitSchema = z.object({
 params: z.object({
  contactId: z.coerce.number(),
 }),
});

export const updateContactDetailSchema = z.object({
 params: z.object({
  number: z.string(),
 }),
 body: z.object({
  notifyName: z.string().optional(),
  nameByUser: z.string().optional(),
  note: z.string().optional(),
 }),
});

export const updateContactLimitSchema = z.object({
 params: z.object({
  contactId: z.string(),
 }),
 body: z.object({
  limitAiResponse: z.boolean().optional(),
  limitationCount: z.number().optional(),
  stopAiResponse: z.boolean().optional(),
 }),
});
