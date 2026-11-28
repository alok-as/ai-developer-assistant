import { OpenAI } from "openai";
import type { Client } from "@modelcontextprotocol/client";

import {
  MAX_RESOURCE_CHARS,
  SEARCH_CODE_EXAMPLES_TOOL,
  SEARCH_DEVELOPER_DOCS_TOOL,
} from "../constants/tools.ts";
import { ToolCallSchema } from "../schema/tool.ts";

import { MAX_RESOURCES_PER_REQUEST } from "../constants/tools.ts";
import { AppError } from "../utils/error.ts";
import type { TMCP } from "../mcp/mcp-init.ts";

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
    listResources: client.listResources,
    readResource: client.readResource,
    executeToolCall,
  };
};

export const createMCPResourceBridge = (client: Client) => {
  const listResources = async () => {
    const { resources } = await client.listResources();
    return resources;
  };

  const readResources = async (uris: string[]) => {
    if (uris.length > MAX_RESOURCES_PER_REQUEST) {
      throw new AppError("Too many resources selected!");
    }

    if (new Set(uris).size !== uris.length) {
      throw new AppError("Duplicate resource uri's are not allowed");
    }

    const { resources } = await client.listResources();
    console.log("called here", resources);

    const availableResources = new Map(
      resources.map((resource) => [resource.uri, resource]),
    );

    for (const uri of uris) {
      if (!availableResources.has(uri)) {
        throw new AppError("Request resource is are not available!");
      }
    }

    const results = await Promise.all(
      uris.map(async (uri) => {
        const resource = availableResources.get(uri);
        const result = await client.readResource({ uri });

        const text = result.contents
          .filter((content) => "text" in content)
          .map((content) => content.text);

        return {
          uri,
          name: resource?.name,
          text: text.slice(0, MAX_RESOURCE_CHARS),
        };
      }),
    );

    return results;
  };

  return {
    listResources,
    readResources,
  };
};
