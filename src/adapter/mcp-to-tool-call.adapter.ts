import { OpenAI } from "openai";
import type { Client } from "@modelcontextprotocol/client";

import {
  SEARCH_CODE_EXAMPLES_TOOL,
  SEARCH_DEVELOPER_DOCS_TOOL,
} from "../constants/tools.ts";
import { ToolCallSchema } from "../schema/tool.ts";

const ALLOWED_TOOLS = new Set([
  SEARCH_DEVELOPER_DOCS_TOOL,
  SEARCH_CODE_EXAMPLES_TOOL,
]);

export const createMCPToolBridge = async (client: Client) => {
  const { tools: discoveredTools } = await client.listTools();
  const allowedTools = discoveredTools.filter((tool) =>
    ALLOWED_TOOLS.has(tool.name),
  );
  const allowedToolNames = new Set(allowedTools.map((tool) => tool.name));

  const tools: OpenAI.Responses.Tool[] = allowedTools.map((tool) => ({
    type: "function",
    name: tool.name,
    description: tool.description ?? "MCP tool",
    parameters: tool.inputSchema,
    strict: false,
  }));

  const executeToolCall = async (name: string, rawArguments: string) => {
    if (!allowedToolNames.has(name)) {
      return JSON.stringify({
        success: false,
        error: `Tool ${name} is not allowed.`,
      });
    }

    try {
      const call = ToolCallSchema.parse({ name, modelArguments: rawArguments });
      const parsedArguements = JSON.parse(call.modelArguments);

      const result = await client.callTool({
        name,
        arguments: parsedArguements,
      });

      return JSON.stringify({
        success: !result.isError,
        content: result.content,
      });
    } catch {
      return JSON.stringify({
        success: false,
        error: "MCP tool execution failed.",
      });
    }
  };

  return {
    tools,
    executeToolCall,
  };
};
