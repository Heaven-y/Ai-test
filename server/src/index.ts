import { createApp } from "./app";
import { getEnv } from "./env";

const { port } = getEnv();
const app = createApp();

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
