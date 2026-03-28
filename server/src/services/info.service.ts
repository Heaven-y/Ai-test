import type { ServiceInfoResponse } from "../types/api";

export function getServiceInfo(): ServiceInfoResponse {
  return {
    ok: true,
    project: {
      name: "AI 工单 Copilot",
      description: "一个用于学习 AI 应用开发的渐进式项目。",
      currentStage: "基础后端工程搭建",
    },
    techStack: {
      frontend: "React 19",
      backend: "Node.js + Express 5",
      database: "SQLite",
      model: "GLM-4.7-Flash",
    },
  };
}
