import { analyzeQuery } from "../controllers/query.ts";
import {
  QUERY_ANALYSE_ZERO_SHOT_PROMPT,
  QUERY_ANALYSE_FEW_SHOT_PROMPT,
} from "../instructions/query-analyzer.ts";
import type { TQueryAnalysis } from "../schema/query.ts";
import type {
  TInstructionVariant,
  TRUN_ANALYSIS,
  TRUN_REPORT,
} from "../types/evaluation.ts";
import { generateReportAnalysis } from "../utils/evaluations.ts";
import { validEvaluationdDataset } from "./dataset.ts";

const RUNS_PER_CASE = 3;

const instructionVariants: TInstructionVariant[] = [
  {
    name: "zero-shot",
    instructions: QUERY_ANALYSE_ZERO_SHOT_PROMPT,
  },
  {
    name: "few-shot",
    instructions: QUERY_ANALYSE_FEW_SHOT_PROMPT,
  },
];

const generateMetrics = () => ({
  totalRuns: 0,
  successfulRuns: 0,
  failureRuns: 0,
  errorRuns: 0,
  totalLatencyMs: 0,
  totalInputTokens: 0,
  totalOutputTokens: 0,
  topicCorrect: 0,
  intentCorrect: 0,
  difficultyCorrect: 0,
  codeExampleCorrect: 0,
  exactMatches: 0,
  error: null,
});

const compareResults = (expected: TQueryAnalysis, received: TQueryAnalysis) => {
  const result = {
    topicCorrect: expected.topic === received.topic,
    intentCorrect: expected.intent === received.intent,
    difficultyCorrect: expected.difficulty === received.difficulty,
    codeExampleCorrect:
      expected.requiresCodeExample === received.requiresCodeExample,
  };

  const isExactMatch = Object.values(result).every(Boolean);
  return { result, isExactMatch };
};

const evaluateInstructions = async (
  variant: TInstructionVariant,
): Promise<TRUN_REPORT> => {
  const metrics = generateMetrics();
  const evaluationResults: TRUN_ANALYSIS[] = [];

  for (let testCase of validEvaluationdDataset) {
    for (let run = 1; run <= RUNS_PER_CASE; run++) {
      const startTime = Date.now();

      try {
        const response = await analyzeQuery(
          testCase.input,
          variant.instructions,
        );

        metrics.totalRuns++;

        const inputTokens = Number(response.usage?.input_tokens ?? 0);
        const outputTokens = Number(response.usage?.output_tokens ?? 0);
        const latencyMs = Date.now() - startTime;

        metrics.totalInputTokens += inputTokens;
        metrics.totalOutputTokens += outputTokens;
        metrics.totalLatencyMs += latencyMs;

        if (!response.output_parsed) {
          metrics.failureRuns++;

          evaluationResults.push({
            testCaseId: testCase.id,
            variant: variant.name,
            run,
            status: "parseError",
            inputTokens,
            outputTokens,
            latencyMs,
            error: null,
          });

          continue;
        }

        const { result, isExactMatch } = compareResults(
          testCase.expected,
          response.output_parsed,
        );

        metrics.successfulRuns++;

        metrics.topicCorrect += Number(result.topicCorrect);
        metrics.intentCorrect += Number(result.intentCorrect);
        metrics.difficultyCorrect += Number(result.difficultyCorrect);
        metrics.codeExampleCorrect += Number(result.codeExampleCorrect);
        metrics.exactMatches += Number(isExactMatch);

        evaluationResults.push({
          testCaseId: testCase.id,
          variant: variant.name,
          run,
          status: "success",
          isExactMatch,
          inputTokens,
          outputTokens,
          latencyMs,
          error: null,
        });

        console.log(
          `${testCase.id} | Run ${run} | ${isExactMatch ? "PASS" : "FAIL"}`,
        );

        if (!isExactMatch) {
          console.log({
            expected: testCase.expected,
            received: response.output_parsed,
          });
        }
      } catch (error) {
        const latencyMs = Date.now() - startTime;

        metrics.errorRuns++;
        metrics.totalLatencyMs += latencyMs;

        evaluationResults.push({
          testCaseId: testCase.id,
          variant: variant.name,
          run,
          status: "error",
          inputTokens: 0,
          outputTokens: 0,
          latencyMs: latencyMs,
          error: error instanceof Error ? error.message : String(error),
        });

        console.error(`Evaluation failed: ${testCase.id}, run ${run}`, error);
      }
    }
  }

  return {
    variant: variant.name,
    metrics,
    results: evaluationResults,
  };
};

export const runEvaluations = async () => {
  const reports: TRUN_REPORT[] = [];

  for (let variant of instructionVariants) {
    const report = await evaluateInstructions(variant);
    reports.push(report);
  }

  const analysisReport = generateReportAnalysis(reports);

  console.table(
    analysisReport.map((report) => ({
      Variant: report.variant,
      "Exact Match": `${report.accuracy.exactMatch}%`,
      Topic: `${report.accuracy.topic}%`,
      Intent: `${report.accuracy.intent}%`,
      Difficulty: `${report.accuracy.difficulty}%`,
      "Code Example": `${report.accuracy.codeExample}%`,
      "Parse Failures": report.failures.failureRuns,
      Errors: report.failures.errors,
      Tokens: report.tokens.total,
      "Avg Latency": `${report.averageLatency / 1000}s`,
    })),
  );

  return reports;
};

runEvaluations().catch(console.error);
