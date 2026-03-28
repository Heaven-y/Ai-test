import type { HealthResponse } from "../types/api";

export function getHealthStatus(): HealthResponse {
  return {
    ok: true,
    service: "ai-ticket-copilot-server",
    timestamp: new Date().toISOString(),
  };
}
