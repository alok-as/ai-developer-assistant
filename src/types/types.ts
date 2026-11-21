import type { TQueryAnalysis } from "../schema/query.ts";

export type TAnalyzeQueryUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

export type TAnalyzeQueryResponse = {
  data: TQueryAnalysis;
  usage: TAnalyzeQueryUsage;
};
