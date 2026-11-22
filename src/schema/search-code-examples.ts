import { z } from "zod";

export const SearchCodeExampleSchema = z.object({
  query: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .describe("The programming concept or code example to find."),
  topic: z
    .enum(["react", "javascript", "typescript"])
    .optional()
    .describe("Optional technology filter."),
});

export type TSearchCodeExample = z.infer<typeof SearchCodeExampleSchema>;
