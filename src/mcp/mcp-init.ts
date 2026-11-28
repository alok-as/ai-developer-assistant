import { createDeveloperKnowledgeClient } from "./developer-knowledge.client.ts";
import { createMCPToolBridge } from "../adapter/mcp-to-tool-call.adapter.ts";

export const initMCP = async () => {
  const client = await createDeveloperKnowledgeClient();

  try {
    const bridge = await createMCPToolBridge(client);

    return {
      client,
      ...bridge,
    };
  } catch (error) {
    await client.close();
    throw error;
  }
};

export type TMCP = Awaited<ReturnType<typeof initMCP>>;
