import {
  SEARCH_DEVELOPER_DOCS_TOOL,
  SEARCH_CODE_EXAMPLES_TOOL,
} from "../../constants/constants.ts";

export const developerAssitantTools = [
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
  {
    type: "function",
    name: SEARCH_CODE_EXAMPLES_TOOL,
    description:
      "Search practical code examples for React, JavaScript, and TypeScript. Use this when the user asks for implementation examples or code snippets.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The code example or programming concept to search for.",
        },
        topic: {
          type: ["string", "null"],
          enum: ["react", "javascript", "typescript", null],
          description: "Optional topic filter. Use null when unspecified.",
        },
      },
      required: ["query", "topic"],
      additionalProperties: false,
    },
  },
] as const;
