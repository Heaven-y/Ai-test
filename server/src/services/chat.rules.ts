import type { ChatDemoIntent } from "../types/api";

interface DemoRuleResult {
  intent: ChatDemoIntent;
  assistantMessage: string;
  suggestions: string[];
}

interface DemoRule {
  intent: ChatDemoIntent;
  pattern: RegExp;
  assistantMessage: string;
  suggestions: string[];
}

const demoRules: DemoRule[] = [
  {
    intent: "learning_plan",
    pattern: /学习路线|怎么学|学习计划/,
    assistantMessage:
      "建议先按“后端接口、前端联调、模型接入、工具调用、知识库检索”这个顺序推进。先把每一层的最小闭环跑通，再逐步替换成真实能力。",
    suggestions: ["先完成聊天接口", "再接前端页面", "最后接入 GLM"],
  },
  {
    intent: "project_scope",
    pattern: /项目|功能|范围/,
    assistantMessage:
      "当前项目主线是 AI 工单 Copilot。首版重点是聊天、工具调用、知识库问答和基础评测，不做微服务和复杂多智能体。",
    suggestions: ["先做聊天", "再做工具调用", "后做知识库"],
  },
  {
    intent: "tech_choice",
    pattern: /技术选型|为什么|react|express|glm/i,
    assistantMessage:
      "当前技术选型优先考虑学习效率和完整闭环：前端用 React 19，后端用 Express 5，模型先用 GLM，后续再逐步增强。",
    suggestions: ["了解当前接口结构", "下一步接真实模型", "保留单体服务方案"],
  },
];

const defaultRuleResult: DemoRuleResult = {
  intent: "general",
  assistantMessage:
    "这是一个演示版聊天回复。当前还没有接入真实大模型，但接口结构已经接近后续真实聊天接口。",
  suggestions: ["试试询问学习路线", "试试询问项目范围", "试试询问技术选型"],
};

export function resolveDemoRule(message: string): DemoRuleResult {
  // 这里把“意图判断 + 回复模板”集中管理，避免 service 文件越来越长。
  const matchedRule = demoRules.find((rule) => rule.pattern.test(message));

  if (!matchedRule) {
    return defaultRuleResult;
  }

  return {
    intent: matchedRule.intent,
    assistantMessage: matchedRule.assistantMessage,
    suggestions: matchedRule.suggestions,
  };
}
