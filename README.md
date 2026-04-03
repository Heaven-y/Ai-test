# AI 工单 Copilot

这是一个面向学习 AI 应用开发的渐进式项目。

当前目标不是一次性把所有功能做完，而是先把调研、需求、架构和路线定清楚，再在这个框架下逐步实现一个可演示、可讲解的 AI 工单与知识库 Copilot。

## 当前已确定方向

- 前端使用 `React 19`
- 后端使用 `Node.js + Express 5`
- 数据库使用 `SQLite`
- 大模型使用 `GLM-4.7-Flash`
- 首版不做微服务
- 首版不依赖额外 MCP

## 当前已经完成

- 前期调研和整体路线文档
- 后端基础工程初始化
- `GET /api/health`
- `GET /api/info`
- `POST /api/chat/echo`
- `POST /api/chat/demo`
- `POST /api/chat/completions`
- 聊天 provider 分层骨架
- 最小 React 聊天页面
- 请求与响应调试面板
- SQLite 会话持久化基础

## 文档入口

优先阅读 [docs/README.md](./docs/README.md)。
