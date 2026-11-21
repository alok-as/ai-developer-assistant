export type TInstructionVariant = {
  name: string;
  instructions: string;
};

export type TRUN_ANALYSIS = {
  testCaseId: string;
  variant: string;
  run: number;
  status: "success" | "error" | "parseError";
  isExactMatch?: boolean;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  error: Error | string | null;
};

export type TMetrics = {
  totalRuns: number;
  successfulRuns: number;
  failureRuns: number;
  errorRuns: number;
  totalLatencyMs: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  topicCorrect: number;
  exactMatches: number;
  intentCorrect: number;
  difficultyCorrect: number;
  codeExampleCorrect: number;
};

export type TRUN_REPORT = {
  variant: string;
  metrics: TMetrics;
  results: TRUN_ANALYSIS[];
};
