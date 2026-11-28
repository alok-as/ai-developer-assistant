import { OpenAI } from "openai";
import type { Client } from "@modelcontextprotocol/client";

import { MAX_RESOURCE_CHARS } from "../../constants/constants.ts";
import { ToolCallSchema } from "../../schema/tool.ts";

import { MAX_RESOURCES_PER_REQUEST } from "../../constants/constants.ts";
import { AppError } from "../../utils/error.ts";
import { isAllowedPrompt, isAllowedTool } from "../../utils/security.ts";

export const createMCPToolBridge = async (client: Client) => {
  const { tools: discoveredTools } = await client.listTools();
  const allowedTools = discoveredTools.filter((tool) =>
    isAllowedTool(tool.name),
  );

  const tools: OpenAI.Responses.Tool[] = allowedTools.map((tool) => ({
    type: "function",
    name: tool.name,
    description: tool.description ?? "MCP tool",
    parameters: tool.inputSchema,
    strict: false,
  }));

  const executeToolCall = async (name: string, rawArguments: string) => {
    if (!isAllowedTool(name)) {
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

export const createMCPPromptBridge = (client: Client) => {
  const listPrompts = async () => {
    const { prompts } = await client.listPrompts();
    const allowedPrompts = prompts.filter((prompt) =>
      isAllowedPrompt(prompt.name),
    );

    return allowedPrompts;
  };

  const getPrompt = async (
    name: string,
    modelArguments: Record<string, string>,
  ) => {
    if (!isAllowedPrompt(name)) {
      throw new AppError("Prompt is not available");
    }

    const result = await client.getPrompt({
      name,
      arguments: modelArguments,
    });

    const messages = result.messages.flatMap((message) => {
      if (message.content.type === "text") {
        return [
          {
            role: message.role,
            content: message.content.text,
          },
        ];
      }

      return [];
    });

    return {
      name,
      messages,
    };
  };

  return {
    listPrompts,
    getPrompt,
  };
};
