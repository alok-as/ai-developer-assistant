import { type Response, type Request } from "express";

import { catchAsync } from "../middleware/error.ts";
import { messageSchema } from "../schema/query.ts";

import type { TMCP } from "../mcp/mcp-init.ts";
import { createDeveloperAssitantService } from "../services/developer-assistant.ts";

export const createAssitantController = (mcp: TMCP) => {
  const assitantService = createDeveloperAssitantService(mcp);

  const chat = catchAsync(async (req: Request, res: Response) => {
    const { message } = messageSchema.parse(req.body);
    const result = await assitantService.chat(message);

    return res.send({
      success: true,
      data: {
        answer: result.data,
        toolCalls: result.toolCalls,
        rounds: result.rounds,
      },
      usage: result.usage,
    });
  });

  return { chat };
};
