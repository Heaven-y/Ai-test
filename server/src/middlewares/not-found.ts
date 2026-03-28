import type { Request, Response } from "express";

import type { ApiErrorResponse } from "../types/api";

export function notFoundHandler(_request: Request, response: Response<ApiErrorResponse>) {
  response.status(404).json({
    ok: false,
    error: {
      code: "NOT_FOUND",
      message: "请求的接口不存在。",
    },
  });
}
