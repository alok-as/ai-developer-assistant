import { Router } from "express";
import { createAssitantController } from "../controllers/assitant.controller.ts";
import type { TMCP } from "../mcp/mcp-init.ts";

export const createAssitantRoutes = (mcp: TMCP) => {
  const router = Router();
  const assitantController = createAssitantController(mcp);

  router.post("/chat", assitantController.chat);
  router.get("/resources", assitantController.listResources);

  return router;
};
