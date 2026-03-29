import { buildDemoReply } from "../services/chat.reply-builder";
import type {
  ChatCompletionsRequest,
  ChatCompletionsResponse,
} from "../types/api";
import type { ChatCompletionProvider } from "./chat.provider";

export function createDemoChatCompletionProvider(): ChatCompletionProvider {
  return {
    async createCompletion(
      input: ChatCompletionsRequest,
    ): Promise<ChatCompletionsResponse> {
      const demoReply = buildDemoReply({
        systemPrompt: input.systemPrompt,
        messages: input.messages,
      });

      return {
        ok: true,
        id: `chatcmpl_${crypto.randomUUID().replace(/-/g, "")}`,
        model: input.model ?? "demo-rule-engine-v1",
        createdAt: new Date().toISOString(),
        output: {
          role: "assistant",
          content: demoReply.assistantMessage,
        },
        finishReason: "stop",
        usage: {
          messageCount: input.messages.length,
        },
      };
    },
  };
}
