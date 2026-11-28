import { config } from "../../config/env.ts";

import { queryAnalysisSchema } from "../../schema/query.ts";
import { openaiClient } from "../../sdk/openai.ts";
import { QUERY_ANALYSE_FEW_SHOT_PROMPT } from "../../instructions/query-analyzer.ts";
import { zodTextFormat } from "openai/helpers/zod.mjs";

export const analyzeQuery = (
  message: string,
  instructions: string = QUERY_ANALYSE_FEW_SHOT_PROMPT,
) => {
  return openaiClient.responses.parse({
    model: config.OPENAI_MODEL,
    instructions,
    input: message,
    text: {
      format: zodTextFormat(queryAnalysisSchema, "developer-assitant-response"),
    },
  });
};
