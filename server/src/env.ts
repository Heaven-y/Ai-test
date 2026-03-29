import { config as loadDotenv } from "dotenv";

loadDotenv();

type ChatProvider = "demo" | "glm";

function parsePort(rawPort: string | undefined) {
  const port = Number(rawPort ?? 3001);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error("PORT 必须是一个合法端口号。");
  }

  return port;
}

function parseChatProvider(rawProvider: string | undefined): ChatProvider {
  if (!rawProvider) {
    return "demo";
  }

  if (rawProvider === "demo" || rawProvider === "glm") {
    return rawProvider;
  }

  throw new Error("CHAT_PROVIDER 只支持 demo 或 glm。");
}

export function getEnv() {
  const port = parsePort(process.env.PORT);
  const chatProvider = parseChatProvider(process.env.CHAT_PROVIDER);
  const glmApiKey = process.env.GLM_API_KEY?.trim() || null;
  const glmModel = process.env.GLM_MODEL?.trim() || "glm-4.7-flash";

  // 这里只做最小校验，确保后面切到 glm provider 时不会在运行期才发现缺 key。
  if (chatProvider === "glm" && !glmApiKey) {
    throw new Error("CHAT_PROVIDER=glm 时必须提供 GLM_API_KEY。");
  }

  return {
    port,
    chatProvider,
    glmApiKey,
    glmModel,
  };
}
