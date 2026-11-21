import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number(),
  ENVIRONMENT: z.enum(["development", "production"]).default("development"),
  OPENAI_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().min(1).default("gpt-6-luna"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", z.treeifyError(parsed.error));
  process.exit(1);
}

export const config = parsed.data;
