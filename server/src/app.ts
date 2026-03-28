import express from "express";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/api/health", (_request, response) => {
    response.json({
      ok: true,
      service: "ai-ticket-copilot-server",
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}
