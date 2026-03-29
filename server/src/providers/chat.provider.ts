import { getEnv } from "../env";
import type {
  ChatCompletionsRequest,
  ChatCompletionsResponse,
} from "../types/api";
import { createDemoChatCompletionProvider } from "./demo-chat.provider";
import { createGlmChatCompletionProvider } from "./glm-chat.provider";

export interface ChatCompletionProvider {
  createCompletion(
    input: ChatCompletionsRequest,
  ): Promise<ChatCompletionsResponse>;
}

let cachedProvider: ChatCompletionProvider | null = null;

export function getChatCompletionProvider() {
  if (cachedProvider) {
    return cachedProvider;
  }

  const env = getEnv();

  // 这里只负责选择 provider，不把真实模型调用细节堆进 service。
  cachedProvider =
    env.chatProvider === "glm"
      ? createGlmChatCompletionProvider(env.glmApiKey!, env.glmModel)
      : createDemoChatCompletionProvider();

  return cachedProvider;
}
