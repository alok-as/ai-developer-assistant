import { openaiClient } from "../services/openai.ts";
import { DEVELOPER_ASSITANT_PROMPT } from "../instructions/developer-assitant.ts";
import { config } from "../config/env.ts";
import { searchDeveloperToolDefinition } from "../tool-definitions/search-tool-defintion.ts";
import { executeTool } from "../tool-definitions/tool-executor.ts";
import { AppError } from "../utils/error.ts";
import { DEVELOPER_ASSISTANT_MAX_TOOL_CALLS } from "../constants/tools.ts";

export const chatWithDevelopersAssitant = async (
  message: string,
  instructions: string = DEVELOPER_ASSITANT_PROMPT,
) => {
  let response = await openaiClient.responses.create({
    model: config.OPENAI_MODEL,
    instructions,
    input: message,
    tools: [...searchDeveloperToolDefinition],
  });

  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalToolCalls = 0;

  for (let round = 1; round <= DEVELOPER_ASSISTANT_MAX_TOOL_CALLS; round++) {
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
    totalToolCalls += toolCalls.length;

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

    const toolOutputs = await Promise.all(
      toolCalls.map(async (call) => {
        try {
          const result = await executeTool(call.name, call.arguments);

          return {
            type: "function_call_output" as const,
            call_id: call.call_id,
            output: JSON.stringify({
              success: true,
              data: result,
            }),
          };
        } catch (error) {
          return {
            type: "function_call_output" as const,
            call_id: call.call_id,
            output: JSON.stringify({
              success: false,
              data: `Tool execution: ${call.name} failed. Check the tool arguements and try again!`,
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
      tools: [...searchDeveloperToolDefinition],
    });
  }

  throw new AppError(
    `Maximum tool execution rounds ${DEVELOPER_ASSISTANT_MAX_TOOL_CALLS} exceeded`,
  );
};
