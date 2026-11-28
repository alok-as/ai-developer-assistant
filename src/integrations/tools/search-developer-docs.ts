import { developerDocs } from "../../knowledge/developer-docs.ts";
import type { TSearchDoc } from "../../schema/search-docs.ts";

export const searchDeveloperTool = ({ query, topic }: TSearchDoc) => {
  const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

  const matchingDocs = developerDocs.filter((doc) => {
    if (!topic || doc.topic !== topic) return false;

    const docTerms = [doc.title, doc.topic, doc.content]
      .join(" ")
      .toLowerCase();

    return queryTerms.some((term) => docTerms.includes(term));
  });

  return {
    results: matchingDocs.slice(0, 5),
    total: matchingDocs.length,
  };
};
