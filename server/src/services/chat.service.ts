import type { ChatEchoResponse } from "../types/api";

export function createEchoReply(message: string): ChatEchoResponse {
  const normalizedMessage = message.trim();

  return {
    ok: true,
    userMessage: normalizedMessage,
    assistantMessage: `我已经收到你的消息：${normalizedMessage}。当前这是最小聊天接口，下一步会把这里替换成真正的模型调用。`,
  };
}
