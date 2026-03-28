import { z } from "zod";

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1, "message 不能为空。"),
});

export const chatHistoryMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1, "消息内容不能为空。"),
});

export const chatDemoSchema = z.object({
  systemPrompt: z.string().trim().min(1, "systemPrompt 不能为空。").optional(),
  messages: z.array(chatHistoryMessageSchema).min(1, "messages 至少需要一条消息。"),
});
