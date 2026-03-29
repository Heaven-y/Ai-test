# 环境变量说明

当前项目用到的环境变量如下。

`.env` 文件当前放在仓库根目录，也就是 [/.env](/e:/web/Ai-test/.env)。

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
- `glm` 表示切换到智谱 provider，并发起真实 HTTP 调用。

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

当你准备好真实调用时，可以改成：

```env
PORT=3001
CHAT_PROVIDER=glm
GLM_API_KEY=你的智谱密钥
GLM_MODEL=glm-4.7-flash
```
