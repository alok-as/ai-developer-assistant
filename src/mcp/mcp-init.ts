import { createDeveloperKnowledgeClient } from "./developer-knowledge.client.ts";
import {
  createMCPPromptBridge,
  createMCPResourceBridge,
  createMCPToolBridge,
} from "../adapter/mcp-to-llm.adapter.ts";

export const initMCP = async () => {
  const client = await createDeveloperKnowledgeClient();

  try {
    const bridge = await createMCPToolBridge(client);
    const resources = await createMCPResourceBridge(client);
    const prompts = await createMCPPromptBridge(client);

    return {
      client,
      ...bridge,
      ...resources,
      ...prompts,
    };
  } catch (error) {
    await client.close();
    throw error;
  }
};

export type TMCP = Awaited<ReturnType<typeof initMCP>>;
