import { resolveDemoRule } from "./chat.rules";
import type {
  ChatDemoResponse,
  ChatEchoResponse,
  ChatHistoryMessage,
} from "../types/api";

interface DemoReplyInput {
  systemPrompt?: string;
  messages: ChatHistoryMessage[];
}

function getLatestUserMessage(messages: ChatHistoryMessage[]) {
  return [...messages].reverse().find((message) => message.role === "user")?.content.trim() ?? "";
}

function buildPromptPrefix(systemPrompt?: string) {
  if (!systemPrompt) {
    return "";
  }

  return `当前系统提示词要求：${systemPrompt}。`;
}

export function createEchoReply(message: string): ChatEchoResponse {
  const normalizedMessage = message.trim();

  return {
    ok: true,
    userMessage: normalizedMessage,
    assistantMessage: `我已经收到你的消息：${normalizedMessage}。当前这是最小聊天接口，下一步会把这里替换成真正的模型调用。`,
  };
}

export function createDemoReply(input: DemoReplyInput): ChatDemoResponse {
  const latestUserMessage = getLatestUserMessage(input.messages);
  const promptPrefix = buildPromptPrefix(input.systemPrompt);
  const resolvedRule = resolveDemoRule(latestUserMessage);

  return {
    ok: true,
    userMessage: latestUserMessage,
    assistantMessage: `${promptPrefix}${resolvedRule.assistantMessage}`,
    intent: resolvedRule.intent,
    suggestions: resolvedRule.suggestions,
    historyCount: input.messages.length,
    appliedSystemPrompt: input.systemPrompt ?? null,
  };
}
