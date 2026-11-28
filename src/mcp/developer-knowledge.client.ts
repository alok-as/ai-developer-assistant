import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

export const createDeveloperKnowledgeClient = async () => {
  const client = new Client({
    name: "developer-assitant",
    version: "1.0.0",
  });

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ["--import", "tsx", "src/mcp/stdio.ts"],
    cwd: process.cwd(),
  });

  await client.connect(transport);
  return client;
};
