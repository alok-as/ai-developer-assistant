import { z } from "zod";
import { SEARCH_DEVELOPER_DOCS_TOOL } from "../constants/tools-name.ts";
import { searchDeveloperTool } from "../tools/search-developer-docs.ts";
import { AppError } from "../utils/error.ts";
import { SearchDocSchema } from "../schema/search-doc.ts";

const ToolCallSchema = z.object({
  name: z.string(),
  arguments: z.string(),
});

export const executeTool = (toolName: string, rawArguemnts: string) => {
  const call = ToolCallSchema.parse({
    name: toolName,
    arguments: rawArguemnts,
  });

  switch (call.name) {
    case SEARCH_DEVELOPER_DOCS_TOOL:
      const parsedArguements: unknown = JSON.parse(call.arguments);
      const normalizedArguments = SearchDocSchema.parse(parsedArguements);

      console.log("normalized arguement", normalizedArguments);
      return searchDeveloperTool(normalizedArguments);

    default:
      throw new AppError(`Unknown tool: ${call.name}`);
  }
};
