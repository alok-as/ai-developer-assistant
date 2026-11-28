import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createDeveloperKnowledgeServer } from "./assitant-knowledge.server.ts";

serveStdio(createDeveloperKnowledgeServer);

console.error("Developer Knowledge MCP Server started");
