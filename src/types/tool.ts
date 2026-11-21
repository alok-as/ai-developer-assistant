export type ToolExecutionContext = {
  signal: AbortSignal;
};

export type ToolExecutionResult = {
  success: boolean;
  data?: unknown;
  error?: {
    code: string;
    message: string;
  };
};

export type TToolHandler = (
  untrustedInput: unknown,
  context: ToolExecutionContext,
) => Promise<unknown>;
