import { openaiClient } from "../../sdk/openai.ts";
import { DEVELOPER_ASSITANT_PROMPT } from "../../instructions/developer-assitant.ts";
import { config } from "../../config/env.ts";
import { AppError } from "../../utils/error.ts";
import {
  MAX_TOOL_CALLS_PER_ROUND,
  MAX_TOOL_ROUNDS,
  MAX_TOTAL_TOOL_CALLS,
} from "../../constants/constants.ts";
import type { TMCP } from "../../integrations/mcp/mcp-init.ts";
import type { TChatSchema } from "../../schema/assitant.ts";
import { formatModelInput } from "../../utils/llms.ts";
import type { TAssitantMessage } from "../../types/mcp.ts";

export const createDeveloperAssitantService = (mcp: TMCP) => {
  const runAgentLoop = async (
    input: string | TAssitantMessage[],
    instructions: string = DEVELOPER_ASSITANT_PROMPT,
  ) => {
    let response = await openaiClient.responses.create({
      model: config.OPENAI_MODEL,
      instructions,
      input: input,
      tools: mcp.tools,
      tool_choice: "auto",
      parallel_tool_calls: true,
    });

    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalToolCalls = 0;

    for (let round = 1; round <= MAX_TOOL_ROUNDS; round++) {
      if (response.status !== "completed") {
        throw new AppError(
          `Model response was not completed: ${response.status}`,
        );
      }

      const toolCalls = response.output.filter(
        (item) => item.type === "function_call",
      );

      totalInputTokens += response?.usage?.input_tokens ?? 0;
      totalOutputTokens += response?.usage?.output_tokens ?? 0;

      if (toolCalls.length === 0) {
        return {
          data: response.output_text,
          usage: {
            inputTokens: totalInputTokens,
            outputTokens: totalOutputTokens,
            totalTokens: totalInputTokens + totalOutputTokens,
          },
          toolCalls: totalToolCalls,
          rounds: round,
        };
      }

      if (toolCalls.length > MAX_TOOL_CALLS_PER_ROUND) {
        throw new Error("Too many tool calls in one round");
      }

      if (
        totalToolCalls > MAX_TOTAL_TOOL_CALLS ||
        totalToolCalls + toolCalls.length > MAX_TOTAL_TOOL_CALLS
      ) {
        throw new Error("Max tool execution limit exceeded");
      }

      totalToolCalls += toolCalls.length;

      const toolOutputs = await Promise.all(
        toolCalls.map(async (call) => {
          try {
            const result = await mcp.executeToolCall(call.name, call.arguments);

            return {
              type: "function_call_output" as const,
              call_id: call.call_id,
              output: JSON.stringify({
                success: true,
                data: result,
              }),
            };
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : "Unknown tool execution error";

            return {
              type: "function_call_output" as const,
              call_id: call.call_id,
              output: JSON.stringify({
                success: false,
                data: message,
              }),
            };
          }
        }),
      );

      response = await openaiClient.responses.create({
        model: config.OPENAI_MODEL,
        instructions,
        previous_response_id: response.id,
        input: [...toolOutputs],
        tools: mcp.tools,
        tool_choice: "auto",
        parallel_tool_calls: true,
      });
    }

    throw new AppError(
      `Maximum tool execution rounds ${MAX_TOOL_ROUNDS} exceeded`,
    );
  };

  const chat = async (
    message: string,
    uris: TChatSchema["resourceUris"],
    instructions: string = DEVELOPER_ASSITANT_PROMPT,
  ) => {
    const selectedResources = await mcp.readResources(uris);
    const input = formatModelInput(message, selectedResources);
    return runAgentLoop(input, instructions);
  };

  const runPrompt = async (
    name: string,
    modelArguments: Record<string, string>,
  ) => {
    const prompt = await mcp.getPrompt(name, modelArguments);
    return runAgentLoop(prompt.messages);
  };

  return { chat, runPrompt };
};
