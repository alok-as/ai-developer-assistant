import { Router } from "express";
import type { TMCP } from "../mcp/mcp-init.ts";

import { createAssitantController } from "../controllers/assitant.controller.ts";

export const createAssitantRoutes = (mcp: TMCP) => {
  const router = Router();
  const assitantController = createAssitantController(mcp);

  router.get("/resources", assitantController.listResources);
  router.get("/prompts", assitantController.listPrompts);

  router.post("/chat", assitantController.chat);
  router.post(`/:name/prompts`, assitantController.runPrompt);

  return router;
};
