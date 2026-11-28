import { z } from "zod";

import { TOOL_CALL_TIMEOUT_MS } from "../constants/tools.ts";
import { ToolExecutionError } from "../utils/error.ts";
import { toolsRegistry } from "../tools/tools-registry.ts";
import { ToolCallSchema } from "../schema/tool.ts";

export const executeTool = (toolName: string, rawArguemnts: string) => {
  const call = ToolCallSchema.safeParse({
    name: toolName,
    modelArguments: rawArguemnts,
  });

  if (!call.success) {
    throw new ToolExecutionError(
      "INVALID_TOOL_CALL",
      "The tool call format is invalid",
    );
  }

  const { name, modelArguments } = call.data;

  const toolCall = toolsRegistry.get(name);

  if (!toolCall) {
    throw new ToolExecutionError(
      "UNKNOWN_TOOL_CALL",
      `The tool ${name} is not available`,
    );
  }

  let parsedArguements: unknown;

  try {
    parsedArguements = JSON.parse(modelArguments);
  } catch {
    throw new ToolExecutionError(
      "INVALID_JSON",
      "Tool arguments must contain valid JSON",
    );
  }

  const signal = AbortSignal.timeout(TOOL_CALL_TIMEOUT_MS);

  try {
    return toolCall(parsedArguements, { signal });
  } catch (error) {
    if (error instanceof ToolExecutionError) {
      throw error;
    }

    if (error instanceof z.ZodError) {
      throw new ToolExecutionError(
        "INVALID_ARGUMENTS",
        "The tool arguments failed validations",
      );
    }

    if (signal.aborted) {
      throw new ToolExecutionError(
        "TOOL_TIMEOUT",
        "The tool execution exceeded its time limit.",
      );
    }

    throw new ToolExecutionError(
      "TOOL_EXECUTION_FAILED",
      "The tool could not complete its operation.",
    );
  }
};
