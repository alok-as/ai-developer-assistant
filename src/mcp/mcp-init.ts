import { createDeveloperKnowledgeClient } from "./developer-knowledge.client.ts";
import {
  createMCPResourceBridge,
  createMCPToolBridge,
} from "../adapter/mcp-to-llm.adapter.ts";

export const initMCP = async () => {
  const client = await createDeveloperKnowledgeClient();

  try {
    const bridge = await createMCPToolBridge(client);
    const resources = await createMCPResourceBridge(client);

    return {
      client,
      ...bridge,
      resources,
    };
  } catch (error) {
    await client.close();
    throw error;
  }
};

export type TMCP = Awaited<ReturnType<typeof initMCP>>;
