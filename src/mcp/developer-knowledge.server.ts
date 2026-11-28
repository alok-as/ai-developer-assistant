import { McpServer } from "@modelcontextprotocol/server";

import { searchDeveloperTool } from "../tools/search-developer-docs.ts";
import { searchCodeExamples } from "../tools/search-code-examples.ts";
import {
  SEARCH_CODE_EXAMPLES_TOOL,
  SEARCH_DEVELOPER_DOCS_TOOL,
} from "../constants/tools.ts";
import { SearchDocSchema } from "../schema/search-docs.ts";
import { SearchCodeExampleSchema } from "../schema/search-code-examples.ts";

export const createDeveloperKnowledgeServer = () => {
  const server = new McpServer({
    name: "developer-knowledge-server",
    version: "1.0.0",
  });

  server.registerTool(
    SEARCH_DEVELOPER_DOCS_TOOL,
    {
      description:
        "Search developer documentation for React, JavaScript, and TypeScript concepts.",
      inputSchema: SearchDocSchema,
    },
    async ({ query, topic }) => {
      const result = searchDeveloperTool({ query, topic });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    },
  );

  server.registerTool(
    SEARCH_CODE_EXAMPLES_TOOL,
    {
      description:
        "Search practical code examples for React, JavaScript, and TypeScript.",
      inputSchema: SearchCodeExampleSchema,
    },
    async ({ query, topic }) => {
      const result = searchCodeExamples({ query, topic });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    },
  );

  return server;
};
