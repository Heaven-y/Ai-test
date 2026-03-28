import type { NextFunction, Request, Response } from "express";

import type { ApiErrorResponse } from "../types/api";

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response<ApiErrorResponse>,
  _next: NextFunction,
) {
  const message = error instanceof Error ? error.message : "服务内部发生未知错误。";

  response.status(500).json({
    ok: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message,
    },
  });
}
