import type {
  ParsedResponse,
  Response,
} from "openai/resources/responses/responses";

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
