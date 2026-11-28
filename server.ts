import express, { type Response, type Request } from "express";

import { config } from "./src/config/env.ts";
import { errorHandler } from "./src/middleware/error.ts";

import { createQueryRoutes } from "./src/app/routes/query.routes.ts";
import { createAssitantRoutes } from "./src/app/routes/assitant.routes.ts";
import { initMCP } from "./src/integrations/mcp/mcp-init.ts";

const initApp = async () => {
  const app = express();
  const mcp = await initMCP();

  app.use(express.json());

  app.get("/api/ping", (_req: Request, res: Response) => {
    res.send("Server is healthy!");
  });

  app.use("/api/query", createQueryRoutes());
  app.use("/api/assistant", createAssitantRoutes(mcp));

  app.use(errorHandler);

  const server = app.listen(config.PORT, () => {
    console.log(`Server up and running on port ${config.PORT}`);
  });

  const shutDown = () => {
    server.close(async () => {
      mcp.client.close();
      process.exit(1);
    });
  };

  process.once("SIGINT", shutDown);
  process.once("SIGTERM", shutDown);
};

initApp().catch((error) => {
  console.log("App startup failed!", error);
  process.exit(1);
});
