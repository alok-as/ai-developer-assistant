import type { TQueryAnalysis } from "../schema/query.ts";

export type TAnalyzeQueryUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

export type TAnalyzeQueryResponse = {
  id: string;
  data: TQueryAnalysis;
  usage: TAnalyzeQueryUsage;
};

export type TDeveloperAssitantResponse = {
  data: string;
  usage: TAnalyzeQueryUsage;
  toolCalls: number;
  rounds: number;
};
