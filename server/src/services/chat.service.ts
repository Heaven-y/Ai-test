import { getChatCompletionProvider } from "../providers/chat.provider";
import type {
  ChatCompletionsRequest,
  ChatCompletionsResponse,
  ChatDemoResponse,
  ChatEchoResponse,
  ChatHistoryMessage,
} from "../types/api";
import { buildDemoReply } from "./chat.reply-builder";

export function createEchoReply(message: string): ChatEchoResponse {
  const normalizedMessage = message.trim();

  return {
    ok: true,
    userMessage: normalizedMessage,
    assistantMessage: `我已经收到你的消息：${normalizedMessage}。当前这是最小聊天接口，下一步会把这里替换成真正的模型调用。`,
  };
}

export function createDemoReply(input: {
  systemPrompt?: string;
  messages: ChatHistoryMessage[];
}): ChatDemoResponse {
  return buildDemoReply(input);
}

export function createCompletionsReply(
  input: ChatCompletionsRequest,
): ChatCompletionsResponse {
  const provider = getChatCompletionProvider();
  return provider.createCompletion(input);
}
