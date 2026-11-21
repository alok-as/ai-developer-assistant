import { z } from "zod";

export const SearchCodeExampleSchema = z.object({
  query: z.string().trim().min(3).max(200),
  topic: z.enum(["react", "javascript", "typescript"]).optional(),
});

export type TSearchCodeExample = z.infer<typeof SearchCodeExampleSchema>;
