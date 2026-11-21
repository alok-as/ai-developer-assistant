import { z } from "zod";
import { queryAnalysisSchema } from "../schema/query.ts";

export const EvaluationCaseSchema = z.object({
  id: z.string(),
  input: z.string(),
  expected: queryAnalysisSchema,
});

export type TEvaluationSchema = z.infer<typeof EvaluationCaseSchema>;

export const evaluationDataset = [
  {
    id: "react-learning",
    input: "Explain how React reconciliation works.",
    expected: {
      topic: "react",
      intent: "learning",
      difficulty: "intermediate",
      requiresCodeExample: true,
      summary: "Understanding how React reconciliation works.",
    },
  },
  {
    id: "react-debugging",
    input: "Why does my useEffect execute twice in development?",
    expected: {
      topic: "react",
      intent: "debugging",
      difficulty: "intermediate",
      requiresCodeExample: true,
      summary: "Debugging repeated execution of a React useEffect hook.",
    },
  },
  {
    id: "javascript-learning",
    input: "Explain JavaScript closures with examples.",
    expected: {
      topic: "javascript",
      intent: "learning",
      difficulty: "intermediate",
      requiresCodeExample: true,
      summary: "Understanding JavaScript closures through examples.",
    },
  },
  {
    id: "typescript-implementation",
    input: "Implement a generic debounce utility in TypeScript.",
    expected: {
      topic: "typescript",
      intent: "implementation",
      difficulty: "intermediate",
      requiresCodeExample: true,
      summary: "Implementing a generic debounce utility in TypeScript.",
    },
  },
  {
    id: "nodejs-learning",
    input: "How does the Node.js event loop work?",
    expected: {
      topic: "node",
      intent: "learning",
      difficulty: "advanced",
      requiresCodeExample: true,
      summary: "Understanding how the Node.js event loop works.",
    },
  },
  {
    id: "dsa-interview",
    input:
      "Solve the longest substring without repeating characters problem for an interview.",
    expected: {
      topic: "dsa",
      intent: "interview_prep",
      difficulty: "intermediate",
      requiresCodeExample: true,
      summary:
        "Solving the longest substring without repeating characters problem.",
    },
  },
  {
    id: "system-design-comparison",
    input: "Compare Redis and Memcached for caching in a distributed system.",
    expected: {
      topic: "system-design",
      intent: "comparison",
      difficulty: "advanced",
      requiresCodeExample: false,
      summary: "Comparing Redis and Memcached for distributed system caching.",
    },
  },
  {
    id: "system-design-learning",
    input: "Explain database sharding and how it improves scalability.",
    expected: {
      topic: "system-design",
      intent: "learning",
      difficulty: "advanced",
      requiresCodeExample: true,
      summary: "Understanding database sharding and its scalability benefits.",
    },
  },
  {
    id: "other-learning",
    input: "Explain the fundamentals of digital photography.",
    expected: {
      topic: "other",
      intent: "learning",
      difficulty: "begineer",
      requiresCodeExample: false,
      summary: "Understanding the fundamentals of digital photography.",
    },
  },
  {
    id: "nodejs-implementation",
    input: "Build a REST API using Express and TypeScript.",
    expected: {
      topic: "node",
      intent: "implementation",
      difficulty: "intermediate",
      requiresCodeExample: true,
      summary: "Building a REST API using Express and TypeScript.",
    },
  },
] satisfies TEvaluationSchema[];

export const validEvaluationdDataset = z
  .array(EvaluationCaseSchema)
  .parse(evaluationDataset);
