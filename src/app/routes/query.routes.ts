import { Router } from "express";
import { createQueryController } from "../controllers/query.controller.ts";

export const createQueryRoutes = () => {
  const router = Router();
  const queryController = createQueryController();

  router.post("/analyze", queryController.analyze);

  return router;
};
