import { z } from "zod";

export const SearchDocSchema = z.object({
  query: z.string().min(2).max(200),
  topic: z.enum(["react", "javascript", "typescript"]).optional(),
});

export type TSearchDoc = z.infer<typeof SearchDocSchema>;
