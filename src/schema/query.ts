import { z } from "zod";

export const messageSchema = z.object({
  message: z.string().trim().min(10).max(400),
});

export const queryAnalysisSchema = z.object({
  topic: z.enum([
    "react",
    "javascript",
    "typescript",
    "node",
    "dsa",
    "system-design",
    "other",
  ]),
  intent: z.enum([
    "learning",
    "debugging",
    "implementation",
    "comparison",
    "interview_prep",
    "other",
  ]),
  difficulty: z.enum(["begineer", "intermediate", "advanced"]),
  requiresCodeExample: z.boolean(),
  summary: z.string().trim().min(1).max(300),
});

export type TQueryAnalysis = z.infer<typeof queryAnalysisSchema>;
