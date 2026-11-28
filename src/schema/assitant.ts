import { z } from "zod";

export const chatSchema = z.object({
  message: z.string().trim().min(10).max(400),
  resourceUris: z
    .array(z.url().or(z.string().startsWith("docs://")))
    .max(3)
    .default([]),
});

export type TChatSchema = z.infer<typeof chatSchema>;
