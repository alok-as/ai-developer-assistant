import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createDeveloperKnowledgeServer } from "./developer-knowledge.server.ts";

serveStdio(createDeveloperKnowledgeServer);

console.error("Developer Knowledge MCP Server started");
