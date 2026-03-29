# 环境变量说明

当前项目用到的环境变量如下。

## PORT

服务监听端口，默认值为 `3001`。

## CHAT_PROVIDER

当前聊天 provider 类型。

可选值：
- `demo`
- `glm`

默认值：

```env
CHAT_PROVIDER=demo
```

说明：
- `demo` 表示使用本地演示 provider，不会发起真实模型请求。
- `glm` 表示切换到智谱 provider 骨架，后续会在这个分支里补上真实 HTTP 调用。

## GLM_API_KEY

智谱开放平台的 API Key。

说明：
- 当 `CHAT_PROVIDER=glm` 时必须提供。
- 当 `CHAT_PROVIDER=demo` 时可以为空。

## GLM_MODEL

智谱模型名称，默认值为：

```env
GLM_MODEL=glm-4.7-flash
```

## 当前推荐配置

本地开发建议先使用：

```env
PORT=3001
CHAT_PROVIDER=demo
GLM_API_KEY=
GLM_MODEL=glm-4.7-flash
```

等我们下一步真正接入智谱 HTTP 调用时，再把 `CHAT_PROVIDER` 改成 `glm`。
