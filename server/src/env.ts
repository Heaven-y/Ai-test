import { config as loadDotenv } from "dotenv";

loadDotenv();

export function getEnv() {
  const port = Number(process.env.PORT ?? 3001);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error("PORT 必须是一个合法端口号。");
  }

  return {
    port,
  };
}
