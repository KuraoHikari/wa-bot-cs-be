import { number, z } from "zod";

const paginationSchema = z.object({
 page: z.string().optional(),
 limit: z.string().optional(),
});

export const getMessagesQuerySchema = z.object({
 query: paginationSchema,
});
