import type { TRUN_REPORT } from "../types/evaluation.ts";

export const calculatePercentage = (
  currentValue: number,
  totalValue: number,
) => {
  if (totalValue === 0) return 0;
  const percentage = (currentValue / totalValue) * 100;
  return Number(percentage.toFixed(2));
};

export const generateReportAnalysis = (reports: TRUN_REPORT[]) => {
  return reports.map(({ variant, metrics }) => ({
    variant,
    totalRuns: metrics.totalRuns,
    accuracy: {
      topic: calculatePercentage(metrics.topicCorrect, metrics.successfulRuns),
      intent: calculatePercentage(
        metrics.intentCorrect,
        metrics.successfulRuns,
      ),
      difficulty: calculatePercentage(
        metrics.difficultyCorrect,
        metrics.successfulRuns,
      ),
      codeExample: calculatePercentage(
        metrics.codeExampleCorrect,
        metrics.successfulRuns,
      ),
      exactMatch: calculatePercentage(metrics.exactMatches, metrics.totalRuns),
    },
    failures: {
      failureRuns: metrics.failureRuns,
      errors: metrics.errorRuns,
    },
    tokens: {
      input: metrics.totalInputTokens,
      output: metrics.totalOutputTokens,
      total: metrics.totalInputTokens + metrics.totalOutputTokens,
    },
    averageLatency: calculatePercentage(
      metrics.totalLatencyMs,
      metrics.totalRuns,
    ),
  }));
};
