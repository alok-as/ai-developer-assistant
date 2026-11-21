import { developerDocs } from "../data/developer-docs.ts";
import { SearchDocSchema, type TSearchDoc } from "../schema/search-doc.ts";

export const searchDeveloperTool = (untrustedInput: unknown) => {
  const { query, topic } = SearchDocSchema.parse(untrustedInput);
  const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

  const matchingDocs = developerDocs
    .filter((doc) => {
      if (!topic || doc.topic !== topic) return false;

      const docTerms = [doc.title, doc.topic, doc.content]
        .join(" ")
        .toLowerCase();

      return queryTerms.some((term) => docTerms.includes(term));
    })
    .slice(0, 5);

  return {
    results: matchingDocs,
    total: matchingDocs.length,
  };
};
