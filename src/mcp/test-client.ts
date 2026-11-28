import { createDeveloperKnowledgeClient } from "./developer-knowledge.client.ts";

const main = async () => {
  const client = await createDeveloperKnowledgeClient();

  try {
    const { resources } = await client.listResources();
    console.log("MCP Resources", resources);

    const { prompts } = await client.listPrompts();
    console.log("MCP Prompts", prompts);

    const { tools } = await client.listTools();
    console.table(
      tools.map((tool) => ({ name: tool.name, description: tool.description })),
    );
  } finally {
    await client.close();
  }
};

main().catch((error) => {
  console.error("MCP client test failed", error);
  process.exitCode = 1;
});
