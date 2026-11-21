import { SEARCH_DEVELOPER_DOCS_TOOL } from "../constants/tools-name.ts";

export const searchDeveloperToolDefinition = [
  {
    type: "function",
    name: SEARCH_DEVELOPER_DOCS_TOOL,
    description:
      "Search the developer documentation dataset for information about React, JavaScript, and TypeScript. Use this when the user asks a technical question that would benefit from documentation.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The technical concept or subject to search for.",
        },
        topic: {
          type: ["string", "null"],
          enum: ["react", "javascript", "typescript", null],
          description: "Optional technical topic to narrow the search.",
        },
      },
      required: ["query", "topic"],
      additionalProperties: false,
    },
  },
] as const;
