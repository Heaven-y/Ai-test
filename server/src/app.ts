import express from "express";
import { createChatRouter } from "./routes/chat.route";
import { createHealthRouter } from "./routes/health.route";
import { createInfoRouter } from "./routes/info.route";
import { notFoundHandler } from "./middlewares/not-found";
import { errorHandler } from "./middlewares/error-handler";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use("/api/health", createHealthRouter());
  app.use("/api/info", createInfoRouter());
  app.use("/api/chat", createChatRouter());
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
