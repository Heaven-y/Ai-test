import { getEnv } from "../env";
import type {
  ChatCompletionsRequest,
  ChatCompletionsResponse,
} from "../types/api";
import { createDemoChatCompletionProvider } from "./demo-chat.provider";
import { createGlmChatCompletionProvider } from "./glm-chat.provider";

export interface ChatCompletionProvider {
  createCompletion(input: ChatCompletionsRequest): ChatCompletionsResponse;
}

let cachedProvider: ChatCompletionProvider | null = null;

export function getChatCompletionProvider() {
  if (cachedProvider) {
    return cachedProvider;
  }

  const env = getEnv();

  // 这里先只做 provider 选择，不把真实模型调用直接塞进 service 里。
  cachedProvider =
    env.chatProvider === "glm"
      ? createGlmChatCompletionProvider(env.glmModel)
      : createDemoChatCompletionProvider();

  return cachedProvider;
}
