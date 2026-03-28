import type { Response } from "express";
import { Router } from "express";

import { getHealthStatus } from "../services/health.service";
import type { HealthResponse } from "../types/api";

export function createHealthRouter() {
  const router = Router();

  router.get("/", (_request, response: Response<HealthResponse>) => {
    response.json(getHealthStatus());
  });

  return router;
}
