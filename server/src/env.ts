import { resolve } from "node:path";
import { config as loadDotenv } from "dotenv";

const rootEnvPath = resolve(__dirname, "..", "..", ".env");
const projectRootPath = resolve(__dirname, "..", "..");

// 固定从仓库根目录读取 .env，避免启动目录不同导致配置失效。
loadDotenv({ path: rootEnvPath });

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
  const dbPath = resolve(
    projectRootPath,
    process.env.DB_PATH?.trim() || "./data/app.db",
  );

  // 这里只做最小校验，避免切到 glm provider 后才发现缺少关键配置。
  if (chatProvider === "glm" && !glmApiKey) {
    throw new Error("CHAT_PROVIDER=glm 时必须提供 GLM_API_KEY。");
  }

  return {
    port,
    chatProvider,
    glmApiKey,
    glmModel,
    dbPath,
  };
}
