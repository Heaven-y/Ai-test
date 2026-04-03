import { getChatCompletionProvider } from "../providers/chat.provider";
import type {
  ChatCompletionsRequest,
  ChatCompletionsResponse,
  ChatDemoResponse,
  ChatEchoResponse,
  ChatHistoryMessage,
} from "../types/api";
import { buildDemoReply } from "./chat.reply-builder";
import { saveChatTurn } from "./chat-session.service";

function getLatestUserMessage(messages: ChatHistoryMessage[]) {
  return (
    [...messages]
      .reverse()
      .find((message) => message.role === "user")
      ?.content.trim() ?? ""
  );
}

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

export async function createCompletionsReply(
  input: ChatCompletionsRequest,
): Promise<ChatCompletionsResponse> {
  const sessionId = input.sessionId?.trim() || crypto.randomUUID();
  const latestUserMessage = getLatestUserMessage(input.messages);
  const provider = getChatCompletionProvider();
  const completion = await provider.createCompletion(input);

  if (latestUserMessage) {
    saveChatTurn({
      sessionId,
      userMessage: latestUserMessage,
      assistantMessage: completion.output.content,
    });
  }

  return {
    ...completion,
    sessionId,
  };
}
