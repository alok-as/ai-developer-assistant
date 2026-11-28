import { SEARCH_DEVELOPER_DOCS_TOOL } from "../constants/tools.ts";
import { AppError } from "../utils/error.ts";
import { createDeveloperKnowledgeClient } from "./developer-knowledge.client.ts";

const main = async () => {
  const client = await createDeveloperKnowledgeClient();

  try {
    const { tools } = await client.listTools();

    for (const tool of tools) {
      console.log({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      });
    }

    const result = await client.callTool({
      name: SEARCH_DEVELOPER_DOCS_TOOL,
      arguments: {
        query: "React Server components",
        topic: "react",
      },
    });

    if (result.isError) {
      throw new AppError(`MCP tool failed: ${JSON.stringify(result.content)}`);
    }

    console.log("\nTool execution result:");
    console.log(result.content);
  } finally {
    await client.close();
  }
};

main().catch((error) => {
  console.error("MCP client test failed", error);
  process.exitCode = 1;
});
