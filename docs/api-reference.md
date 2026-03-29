# 接口文档

当前后端基础地址默认为 `http://localhost:3001`。

## 通用错误响应

当请求参数不合法时，接口会返回：

```json
{
  "ok": false,
  "error": {
    "code": "INVALID_MESSAGE",
    "message": "具体错误信息"
  }
}
```

## GET /api/health

用途：用于确认服务是否正常启动。

响应示例：

```json
{
  "ok": true,
  "service": "ai-ticket-copilot-server",
  "timestamp": "2026-03-29T08:00:00.000Z"
}
```

## GET /api/info

用途：返回当前项目的基础信息，便于前端做启动页或状态展示。

响应示例：

```json
{
  "ok": true,
  "project": {
    "name": "AI 工单 Copilot",
    "description": "一个用于学习 AI 应用开发的渐进式项目。",
    "currentStage": "基础后端工程搭建"
  },
  "techStack": {
    "frontend": "React 19",
    "backend": "Node.js + Express 5",
    "database": "SQLite",
    "model": "GLM-4.7-Flash"
  }
}
```

## POST /api/chat/echo

用途：最小聊天接口，用来确认聊天链路已打通。

请求体：

```json
{
  "message": "你好"
}
```

响应示例：

```json
{
  "ok": true,
  "userMessage": "你好",
  "assistantMessage": "我已经收到你的消息：你好。当前这是最小聊天接口，下一步会把这里替换成真正的模型调用。"
}
```

## POST /api/chat/demo

用途：演示版聊天接口，支持多轮消息和可选的系统提示词。

请求体：

```json
{
  "systemPrompt": "请用导师口吻回答",
  "messages": [
    {
      "role": "user",
      "content": "这个项目的学习路线是什么？"
    }
  ]
}
```

响应示例：

```json
{
  "ok": true,
  "userMessage": "这个项目的学习路线是什么？",
  "assistantMessage": "当前系统提示词要求：请用导师口吻回答。建议先按“后端接口、前端联调、模型接入、工具调用、知识库检索”这个顺序推进。先把每一层的最小闭环跑通，再逐步替换成真实能力。",
  "intent": "learning_plan",
  "suggestions": [
    "先完成聊天接口",
    "再接前端页面",
    "最后接入 GLM"
  ],
  "historyCount": 1,
  "appliedSystemPrompt": "请用导师口吻回答"
}
```

字段说明：
- `intent`：当前演示规则判断出的意图类型。
- `suggestions`：下一步建议列表。
- `historyCount`：本次请求中携带的消息条数。
- `appliedSystemPrompt`：实际应用的系统提示词，没有则为 `null`。

## POST /api/chat/completions

用途：更接近真实模型接口的聊天入口，当前已经接入 provider 分层，但默认仍由 demo provider 返回结果。

请求体：

```json
{
  "model": "demo-rule-engine-v1",
  "systemPrompt": "请简洁回答",
  "messages": [
    {
      "role": "user",
      "content": "这个项目怎么学？"
    }
  ]
}
```

响应示例：

```json
{
  "ok": true,
  "id": "chatcmpl_xxx",
  "model": "demo-rule-engine-v1",
  "createdAt": "2026-03-29T08:00:00.000Z",
  "output": {
    "role": "assistant",
    "content": "当前系统提示词要求：请简洁回答。建议先按“后端接口、前端联调、模型接入、工具调用、知识库检索”这个顺序推进。先把每一层的最小闭环跑通，再逐步替换成真实能力。"
  },
  "finishReason": "stop",
  "usage": {
    "messageCount": 1
  }
}
```

字段说明：
- `id`：本次聊天结果的唯一标识。
- `model`：当前实际返回结果所使用的 provider 模型标识。
- `output`：当前统一的模型输出结构。
- `usage.messageCount`：本次请求中携带的消息数量。

## 当前接口边界

当前接口文档只覆盖已经实现的基础能力：
- 基础健康检查
- 项目信息读取
- 最小聊天接口
- 演示版聊天接口
- provider 分层后的 completions 接口

后续一旦新增真实 GLM 调用、会话管理、工具调用或知识库接口，必须同步更新本文件。
