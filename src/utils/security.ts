import {
  EXPLAIN_CONCEPT_PROMPT,
  SEARCH_CODE_EXAMPLES_TOOL,
  SEARCH_DEVELOPER_DOCS_TOOL,
} from "../constants/tools.ts";

const ALLOWED_TOOL_NAMES = new Set([
  SEARCH_DEVELOPER_DOCS_TOOL,
  SEARCH_CODE_EXAMPLES_TOOL,
]);

const ALLOWED_PROMPT_NAMES = new Set([EXPLAIN_CONCEPT_PROMPT]);

export const isAllowedTool = (name: string) => ALLOWED_TOOL_NAMES.has(name);
export const isAllowedPrompt = (name: string) => ALLOWED_PROMPT_NAMES.has(name);
