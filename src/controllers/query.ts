import { type Response, type Request } from "express";

import { catchAsync } from "../middleware/error.ts";
import { messageSchema } from "../schema/query.ts";
import { AppError } from "../utils/error.ts";
import { analyzeQuery } from "../services/query-analyzer.ts";
import { formatModelUsage } from "../utils/llms.ts";

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
      data: response.output_parsed,
      usage: formatModelUsage(response),
    });
  },
);
