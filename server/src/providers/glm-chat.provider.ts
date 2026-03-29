import type {
  ChatCompletionsRequest,
  ChatCompletionsResponse,
} from "../types/api";
import type { ChatCompletionProvider } from "./chat.provider";

export function createGlmChatCompletionProvider(
  model: string,
): ChatCompletionProvider {
  return {
    createCompletion(input: ChatCompletionsRequest): ChatCompletionsResponse {
      return {
        ok: true,
        id: `chatcmpl_${crypto.randomUUID().replace(/-/g, "")}`,
        model: input.model ?? model,
        createdAt: new Date().toISOString(),
        output: {
          role: "assistant",
          // 这里先返回占位结果，下一步再把它替换成真正的 GLM HTTP 调用。
          content:
            "当前已经切到 GLM provider 骨架，但还没有发起真实模型请求。下一步会在这里接入智谱开放平台接口。",
        },
        finishReason: "stop",
        usage: {
          messageCount: input.messages.length,
        },
      };
    },
  };
}
