import { z } from "zod";

export const SearchDocSchema = z.object({
  query: z
    .string()
    .min(2)
    .max(200)
    .describe("The documentation topic to search for."),
  topic: z
    .enum(["react", "javascript", "typescript"])
    .optional()
    .describe("Optional technology filter."),
});

export type TSearchDoc = z.infer<typeof SearchDocSchema>;
