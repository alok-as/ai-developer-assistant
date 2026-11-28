import { codeExamples } from "../../knowledge/code-examples.ts";
import type { TSearchCodeExample } from "../../schema/search-code-examples.ts";

export const searchCodeExamples = ({ query, topic }: TSearchCodeExample) => {
  const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

  const matchingExamples = codeExamples.filter((example) => {
    if (!topic || example.topic !== topic) return false;

    const exampleTerms = [
      example.title,
      example.topic,
      example.description,
      example.code,
    ]
      .join(" ")
      .toLowerCase();

    return queryTerms.some((term) => exampleTerms.includes(term));
  });

  return {
    results: matchingExamples.slice(0, 5),
    total: matchingExamples.length,
  };
};
