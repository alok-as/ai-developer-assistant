import { Router } from "express";
import { createAssitantController } from "../controllers/assitant.controller.ts";

export const createAssitantRoutes = () => {
  const router = Router();
  const assitantController = createAssitantController();

  router.post("/chat", assitantController.chat);

  return router;
};
