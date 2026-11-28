import { z } from "zod";

export const explainConceptSchema = z.object({
  concept: z.string().min(2).max(150),
  experienceLevel: z.enum(["begineer", "intermediate", "advanced"]),
});
