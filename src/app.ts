import express, { type Response, type Request } from "express";

import { config } from "./config/env.ts";
import { askDeveloperQuery } from "./controllers/query.ts";
import { errorHandler } from "./middleware/error.ts";

const app = express();
app.use(express.json());

app.get("/api/ping", (req: Request, res: Response) => {
  res.send("Server is healthy!");
});

app.post("/api/chat", askDeveloperQuery);

app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`Server up and running on port ${config.PORT}`);
});
