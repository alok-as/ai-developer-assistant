import { type Response, type Request } from "express";

import { catchAsync } from "../../middleware/error.ts";

import type { TMCP } from "../../integrations/mcp/mcp-init.ts";
import { createDeveloperAssitantService } from "../services/developer-assistant.ts";
import { chatSchema } from "../../schema/assitant.ts";
import { promptNameSchema, promptSchema } from "../../schema/prompt.ts";

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
    const resources = await mcp.listResources();

    return res.send({
      success: true,
      data: resources,
    });
  });

  const listPrompts = catchAsync(async (req: Request, res: Response) => {
    const prompts = await mcp.listPrompts();

    return res.send({
      success: true,
      data: prompts,
    });
  });

  const runPrompt = catchAsync(async (req: Request, res: Response) => {
    const { name } = promptNameSchema.parse(req.params);
    const { arguments: modelArguments } = promptSchema.parse(req.body);

    const result = await assitantService.runPrompt(name, modelArguments);

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

  return { chat, listResources, listPrompts, runPrompt };
};
