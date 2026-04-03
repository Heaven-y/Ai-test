import type {
  ChatCompletionResult,
  ChatCompletionsRequest,
} from "../types/api";
import type { ChatCompletionProvider } from "./chat.provider";

const GLM_CHAT_COMPLETIONS_URL =
  "https://open.bigmodel.cn/api/paas/v4/chat/completions";

interface GlmChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GlmChatCompletionsResponse {
  id?: string;
  model?: string;
  created?: number;
  choices?: Array<{
    finish_reason?: string;
    message?: {
      role?: string;
      content?: string;
    };
  }>;
}

function buildGlmMessages(input: ChatCompletionsRequest): GlmChatMessage[] {
  const messages: GlmChatMessage[] = [];

  if (input.systemPrompt) {
    messages.push({
      role: "system",
      content: input.systemPrompt,
    });
  }

  messages.push(...input.messages);

  return messages;
}

function resolveCreatedAt(created?: number) {
  if (!created) {
    return new Date().toISOString();
  }

  return new Date(created * 1000).toISOString();
}

function readAssistantContent(result: GlmChatCompletionsResponse) {
  const content = result.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("GLM 返回结果缺少 assistant 内容。");
  }

  return content;
}

export function createGlmChatCompletionProvider(
  apiKey: string,
  model: string,
): ChatCompletionProvider {
  return {
    async createCompletion(
      input: ChatCompletionsRequest,
    ): Promise<ChatCompletionResult> {
      const response = await fetch(GLM_CHAT_COMPLETIONS_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: input.model ?? model,
          messages: buildGlmMessages(input),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `GLM 请求失败: ${response.status} ${response.statusText} ${errorText}`,
        );
      }

      const result = (await response.json()) as GlmChatCompletionsResponse;

      return {
        ok: true,
        id: result.id ?? `chatcmpl_${crypto.randomUUID().replace(/-/g, "")}`,
        model: result.model ?? input.model ?? model,
        createdAt: resolveCreatedAt(result.created),
        output: {
          role: "assistant",
          content: readAssistantContent(result),
        },
        finishReason: "stop",
        usage: {
          messageCount: input.messages.length,
        },
      };
    },
  };
}
