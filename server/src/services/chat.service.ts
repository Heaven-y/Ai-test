import type {
  ChatDemoResponse,
  ChatEchoResponse,
  ChatHistoryMessage,
} from "../types/api";

function getLatestUserMessage(messages: ChatHistoryMessage[]) {
  return [...messages].reverse().find((message) => message.role === "user")?.content.trim() ?? "";
}

export function createEchoReply(message: string): ChatEchoResponse {
  const normalizedMessage = message.trim();

  return {
    ok: true,
    userMessage: normalizedMessage,
    assistantMessage: `我已经收到你的消息：${normalizedMessage}。当前这是最小聊天接口，下一步会把这里替换成真正的模型调用。`,
  };
}

export function createDemoReply(messages: ChatHistoryMessage[]): ChatDemoResponse {
  const latestUserMessage = getLatestUserMessage(messages);

  if (/学习路线|怎么学|学习计划/.test(latestUserMessage)) {
    return {
      ok: true,
      userMessage: latestUserMessage,
      assistantMessage:
        "建议先按“后端接口、前端联调、模型接入、工具调用、知识库检索”这个顺序推进。先把每一层的最小闭环跑通，再逐步替换成真实能力。",
      intent: "learning_plan",
      suggestions: ["先完成聊天接口", "再接前端页面", "最后接入 GLM"],
      historyCount: messages.length,
    };
  }

  if (/项目|功能|范围/.test(latestUserMessage)) {
    return {
      ok: true,
      userMessage: latestUserMessage,
      assistantMessage:
        "当前项目主线是 AI 工单 Copilot。首版重点是聊天、工具调用、知识库问答和基础评测，不做微服务和复杂多智能体。",
      intent: "project_scope",
      suggestions: ["先做聊天", "再做工具调用", "后做知识库"],
      historyCount: messages.length,
    };
  }

  if (/技术选型|为什么|react|express|glm/i.test(latestUserMessage)) {
    return {
      ok: true,
      userMessage: latestUserMessage,
      assistantMessage:
        "当前技术选型优先考虑学习效率和完整闭环：前端用 React 19，后端用 Express 5，模型先用 GLM，后续再逐步增强。",
      intent: "tech_choice",
      suggestions: ["了解当前接口结构", "下一步接真实模型", "保留单体服务方案"],
      historyCount: messages.length,
    };
  }

  return {
    ok: true,
    userMessage: latestUserMessage,
    assistantMessage:
      "这是一个演示版聊天回复。当前还没有接入真实大模型，但接口结构已经接近后续真实聊天接口。",
    intent: "general",
    suggestions: ["试试询问学习路线", "试试询问项目范围", "试试询问技术选型"],
    historyCount: messages.length,
  };
}
