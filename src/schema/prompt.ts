import { z } from "zod";

export const promptNameSchema = z.object({
  name: z.string().min(3).max(150),
});

export const promptSchema = z.object({
  arguments: z.record(z.string(), z.string()),
});

export const explainConceptSchema = z.object({
  concept: z.string().min(2).max(150),
  experienceLevel: z.enum(["begineer", "intermediate", "advanced"]),
});
