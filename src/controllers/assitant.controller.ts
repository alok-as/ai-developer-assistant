import { type Response, type Request } from "express";

import { catchAsync } from "../middleware/error.ts";
import { messageSchema } from "../schema/query.ts";
import { chatWithDevelopersAssitant } from "../services/developer-assistant.ts";

export const createAssitantController = () => {
  const chat = catchAsync(async (req: Request, res: Response) => {
    const { message } = messageSchema.parse(req.body);
    const result = await chatWithDevelopersAssitant(message);

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
