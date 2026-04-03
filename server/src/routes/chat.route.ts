import type { Request, Response } from "express";
import { Router } from "express";
import { ZodError } from "zod";

import {
  chatCompletionsSchema,
  chatDemoSchema,
  chatMessageSchema,
} from "../schemas/chat.schema";
import {
  createCompletionsReply,
  createDemoReply,
  createEchoReply,
} from "../services/chat.service";
import type {
  ApiErrorResponse,
  ChatCompletionsRequest,
  ChatCompletionsResponse,
  ChatDemoRequest,
  ChatDemoResponse,
  ChatEchoResponse,
} from "../types/api";

function parseChatMessage(body: unknown) {
  const parsed = chatMessageSchema.parse(body);
  return parsed.message;
}

function parseChatDemoRequest(body: unknown): ChatDemoRequest {
  return chatDemoSchema.parse(body);
}

function parseChatCompletionsRequest(body: unknown): ChatCompletionsRequest {
  return chatCompletionsSchema.parse(body);
}

function buildValidationErrorResponse(error: ZodError): ApiErrorResponse {
  return {
    ok: false,
    error: {
      code: "INVALID_MESSAGE",
      message: error.issues[0]?.message ?? "请求参数不合法。",
    },
  };
}

export function createChatRouter() {
  const router = Router();

  router.post(
    "/echo",
    (
      request: Request,
      response: Response<ChatEchoResponse | ApiErrorResponse>,
    ) => {
      try {
        // zod 的 parse 是同步抛错，所以这里可以直接用 try...catch 处理校验失败。
        const message = parseChatMessage(request.body);
        response.json(createEchoReply(message));
      } catch (error) {
        // 参数校验失败时直接返回 400，避免把用户输入问题当成服务异常。
        if (error instanceof ZodError) {
          response.status(400).json(buildValidationErrorResponse(error));
          return;
        }

        // 非校验类错误继续交给全局错误处理中间件统一处理。
        throw error;
      }
    },
  );

  router.post(
    "/demo",
    (
      request: Request,
      response: Response<ChatDemoResponse | ApiErrorResponse>,
    ) => {
      try {
        const payload = parseChatDemoRequest(request.body);
        response.json(createDemoReply(payload));
      } catch (error) {
        if (error instanceof ZodError) {
          response.status(400).json(buildValidationErrorResponse(error));
          return;
        }

        throw error;
      }
    },
  );

  router.post(
    "/completions",
    async (
      request: Request,
      response: Response<ChatCompletionsResponse | ApiErrorResponse>,
    ) => {
      try {
        const payload = parseChatCompletionsRequest(request.body);

        // completions 会发起异步 provider 调用，所以这里需要等待结果。
        response.json(await createCompletionsReply(payload));
      } catch (error) {
        if (error instanceof ZodError) {
          response.status(400).json(buildValidationErrorResponse(error));
          return;
        }

        throw error;
      }
    },
  );

  return router;
}
