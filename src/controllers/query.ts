import { type Response, type Request } from "express";
import { config } from "../config/env.ts";

import { catchAsync } from "../middleware/error.ts";
import { queryAnalysisSchema, messageSchema } from "../schema/query.ts";
import { openaiClient } from "../services/openai.ts";
import { QUERY_ANALYSE_FEW_SHOT_PROMPT } from "../instructions/query-analyzer.ts";
import { zodTextFormat } from "openai/helpers/zod.mjs";
import { AppError } from "../utils/error.ts";

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

export const askDeveloperQuery = catchAsync(
  async (req: Request, res: Response) => {
    const { message } = messageSchema.parse(req.body);
    const response = await analyzeQuery(message);

    if (!response.output_parsed) {
      throw new AppError("The model did not return structured output", 500);
    }

    // TODO - CHECK IF WE NEED TO ADD ERROR HANDLING HERE
    res.send({
      id: response.id,
      answer: response.output_parsed,
      usage: response.usage
        ? {
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens,
            totalTokens: response.usage.total_tokens,
          }
        : null,
    });
  },
);
