import OpenAI from "openai";
import { config } from "../config/env.ts";

export const openaiClient = new OpenAI({
  apiKey: config.OPENAI_KEY,
});
