import type { Response } from "express";
import { Router } from "express";

import { getServiceInfo } from "../services/info.service";
import type { ServiceInfoResponse } from "../types/api";

export function createInfoRouter() {
  const router = Router();

  router.get("/", (_request, response: Response<ServiceInfoResponse>) => {
    response.json(getServiceInfo());
  });

  return router;
}
