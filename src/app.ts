import express, { type Response, type Request } from "express";

import { config } from "./config/env.ts";
import { errorHandler } from "./middleware/error.ts";

import { createQueryRoutes } from "./routes/query.routes.ts";
import { createAssitantRoutes } from "./routes/assitant.routes.ts";

const app = express();
app.use(express.json());

app.get("/api/ping", (_req: Request, res: Response) => {
  res.send("Server is healthy!");
});

app.use("/api/query", createQueryRoutes());
app.use("/api/assistant", createAssitantRoutes());

app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`Server up and running on port ${config.PORT}`);
});
