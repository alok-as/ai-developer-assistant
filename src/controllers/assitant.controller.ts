import { type Response, type Request } from "express";

import { catchAsync } from "../middleware/error.ts";

import type { TMCP } from "../mcp/mcp-init.ts";
import { createDeveloperAssitantService } from "../services/developer-assistant.ts";
import { chatSchema } from "../schema/assitant.ts";

export const createAssitantController = (mcp: TMCP) => {
  const assitantService = createDeveloperAssitantService(mcp);

  const chat = catchAsync(async (req: Request, res: Response) => {
    const { message, resourceUris } = chatSchema.parse(req.body);
    const result = await assitantService.chat(message, resourceUris);

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

  const listResources = catchAsync(async (req: Request, res: Response) => {
    const resources = await mcp.resources.listResources();

    return res.send({
      success: true,
      data: resources,
    });
  });

  return { chat, listResources };
};
