import { z } from "zod";

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1, "message 不能为空。"),
});
