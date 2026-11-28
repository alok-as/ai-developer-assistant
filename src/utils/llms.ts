import type {
  ParsedResponse,
  Response,
} from "openai/resources/responses/responses";
import type { TResource } from "../types/mcp.ts";

export const formatModelUsage = <T>(
  response:
    | ParsedResponse<T>
    | (Response & {
        _request_id?: string | null;
      }),
) => {
  if (!response.usage) return null;

  return {
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    totalTokens: response.usage.total_tokens,
  };
};

export const formatModelInput = (message: string, resources: TResource[]) => {
  const resourceContext = resources
    .map((resource) =>
      `<resource uri=${resource.uri} name=${resource.name}>${resource.text}</resource>`.trim(),
    )
    .join("\n\n");

  const input =
    resourceContext.length > 0
      ? `
        Reference documentation: 
        ${resourceContext}
  
        User question:
        ${message}
      `.trim()
      : message;

  return input;
};
