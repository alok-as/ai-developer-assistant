import { z } from "zod";

import { SearchDocSchema } from "../schema/search-docs.ts";
import { SearchCodeExampleSchema } from "../schema/search-code-examples.ts";

import { searchDeveloperTool } from "./search-developer-docs.ts";
import { searchCodeExamples } from "./search-code-examples.ts";

import type { TToolHandler, ToolExecutionContext } from "../types/tool.ts";
import {
  SEARCH_DEVELOPER_DOCS_TOOL,
  SEARCH_CODE_EXAMPLES_TOOL,
} from "../constants/tools.ts";

const defineTool = <T>(
  schema: z.ZodType<T>,
  handler: (
    input: T,
    context: ToolExecutionContext,
  ) => Promise<unknown> | unknown,
) => {
  return async (untrustedInput: unknown, context: ToolExecutionContext) => {
    const validatedInput = schema.parse(untrustedInput);
    return handler(validatedInput, context);
  };
};

export const toolsRegistry = new Map<string, TToolHandler>();

toolsRegistry.set(
  SEARCH_DEVELOPER_DOCS_TOOL,
  defineTool(SearchDocSchema, (input) => searchDeveloperTool(input)),
);

toolsRegistry.set(
  SEARCH_CODE_EXAMPLES_TOOL,
  defineTool(SearchCodeExampleSchema, (input) => searchCodeExamples(input)),
);
