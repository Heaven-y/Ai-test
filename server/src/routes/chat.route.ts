import type { Request, Response } from "express";
import { Router } from "express";

import { createEchoReply } from "../services/chat.service";
import type { ApiErrorResponse, ChatEchoRequest, ChatEchoResponse } from "../types/api";

export function createChatRouter() {
  const router = Router();

  router.post(
    "/echo",
    (
      request: Request<Record<string, never>, ChatEchoResponse | ApiErrorResponse, ChatEchoRequest>,
      response: Response<ChatEchoResponse | ApiErrorResponse>,
    ) => {
      const message = request.body?.message?.trim();

      if (!message) {
        response.status(400).json({
          ok: false,
          error: {
            code: "INVALID_MESSAGE",
            message: "message 不能为空。",
          },
        });
        return;
      }

      response.json(createEchoReply(message));
    },
  );

  return router;
}
