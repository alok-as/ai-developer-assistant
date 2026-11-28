import { McpServer } from "@modelcontextprotocol/server";

import { searchDeveloperTool } from "../tools/search-developer-docs.ts";
import { searchCodeExamples } from "../tools/search-code-examples.ts";
import {
  EXPLAIN_CONCEPT_PROMPT,
  REACT_SERVER_COMPONENTS_RESOURCE_NAME,
  REACT_SERVER_COMPONENTS_RESOURCE_URI,
  SEARCH_CODE_EXAMPLES_TOOL,
  SEARCH_DEVELOPER_DOCS_TOOL,
} from "../../constants/constants.ts";
import { SearchDocSchema } from "../../schema/search-docs.ts";
import { SearchCodeExampleSchema } from "../../schema/search-code-examples.ts";
import { explainConceptSchema } from "../../schema/prompt.ts";

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

  server.registerResource(
    REACT_SERVER_COMPONENTS_RESOURCE_NAME,
    REACT_SERVER_COMPONENTS_RESOURCE_URI,
    {
      title: "React server components",
      description: "Reference material about React Server components",
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: `# React Server Components
            React Server Components (RSC) are React components that render
            on the server.

            ## Key characteristics

            - They can access server-side data sources.
            - Their code does not need to be shipped to the browser.
            - They cannot use client-side interactive hooks such as useState.
            - They can be composed with Client Components.

            ## Client Components

            Use Client Components when you need browser APIs, event handlers,
            or interactive state.

            ## Important distinction

            A Server Component is not the same thing as a component that
            uses server-side rendering. Server Components are part of
            React's component architecture.
          `,
        },
      ],
    }),
  );

  server.registerPrompt(
    EXPLAIN_CONCEPT_PROMPT,
    {
      title: "Explain a technical concept",
      description:
        "Generate a structured explanation of a software engineering concept",
      argsSchema: explainConceptSchema,
    },
    async ({ concept, experienceLevel }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `
                Explain the following software engineering concept:

                Concept: ${concept}
                Experience level: ${experienceLevel}

                Follow this structure:

                1. Start with the core intuition.
                2. Explain how it works internally.
                3. Give a practical TypeScript example.
                4. Explain common mistakes.
                5. Summarize the key takeaways.

                Use clear language. Adapt the technical depth
                to the requested experience level.
              `.trim(),
            },
          },
        ],
      };
    },
  );

  return server;
};
