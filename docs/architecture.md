# 架构说明

## 当前总体结构

当前仓库按三部分组织：

- `client`：前端界面，当前已经有一个最小聊天页面。
- `server`：后端接口和 AI 能力编排。
- `docs`：调研、需求、架构、接口和路线文档。

## 当前后端分层

当前后端采用“模块化单体”结构，不做微服务。

已落地的基础分层如下：

- `routes`：负责接收 HTTP 请求和返回响应。
- `services`：负责流程编排和数据准备。
- `providers`：负责聊天结果的提供方式选择，后续真实模型调用也放这里。
- `schemas`：负责请求参数校验。
- `types`：负责接口类型定义。
- `middlewares`：负责 404 和全局错误处理。
- `env`：负责环境变量读取与校验。
- `infra`：负责数据库连接和基础设施初始化。

前端当前采用：

- `React 19 + Vite`
- 开发态通过 Vite 代理把 `/api` 转发到 `http://localhost:3001`

## 当前聊天链路

以 `POST /api/chat/completions` 为例，当前链路是：

1. `route` 接收请求。
2. `schema` 校验请求体是否合法。
3. `service` 生成或续用 `sessionId`。
4. `service` 调用 `provider` 获取聊天结果。
5. `service` 把最新一轮用户消息和 assistant 回复写入 `SQLite`。
6. 路由返回统一响应结构。

## 为什么会有多个 provider 文件

当前 provider 分成三层：

- `chat.provider.ts`
  作用是总入口和选择器，只负责根据环境变量决定用哪个 provider。
- `demo-chat.provider.ts`
  作用是演示版实现，当前默认走这里，不发起真实网络请求。
- `glm-chat.provider.ts`
  作用是智谱实现入口，当前已经负责真实 GLM HTTP 调用。

这样拆的目的不是为了复杂，而是为了让“切换 provider”和“provider 内部实现”分开。后面即使你想再加别的模型，也只是在 `providers` 目录下加新实现，不需要改聊天路由。

## 当前技术框架

- 前端：`React 19 + TypeScript`
- 后端：`Node.js + Express 5`
- 数据库：`SQLite + better-sqlite3`
- 检索：后续首版先用 `SQLite FTS`
- 模型：`GLM-4.7-Flash`

## 当前已经实现的部分

当前后端已经完成：

- 服务启动入口
- 环境变量读取
- 健康检查接口
- 项目信息接口
- 聊天 echo 接口
- 演示版聊天接口
- 基础 completions 接口
- provider 分层骨架
- GLM provider 真实 HTTP 调用入口
- SQLite 会话与消息落库

当前前端已经完成：

- 最小聊天页面
- 消息输入与发送
- 调用 `/api/chat/completions`
- 展示请求和响应结构
- 自动续用 `sessionId`

## 后续演进方向

下一步会继续沿着当前分层推进，而不是推倒重来：

- 增加会话历史读取接口
- 再补工具调用和知识库能力
- 文档和接口保持同步更新
