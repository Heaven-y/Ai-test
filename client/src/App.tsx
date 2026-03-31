import { useState, type SubmitEventHandler } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatCompletionResponse {
  ok: true;
  id: string;
  model: string;
  createdAt: string;
  output: {
    role: "assistant";
    content: string;
  };
  finishReason: "stop";
  usage: {
    messageCount: number;
  };
}

interface ApiErrorResponse {
  ok: false;
  error: {
    code: string;
    message: string;
  };
}

const DEFAULT_SYSTEM_PROMPT = "请用导师口吻回答，并保持简洁、直接。";

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
  };
}

interface ChatRequestPayload {
  systemPrompt?: string;
  messages: Array<Pick<ChatMessage, "role" | "content">>;
}

function buildChatRequestPayload(
  messages: ChatMessage[],
  systemPrompt: string,
): ChatRequestPayload {
  const normalizedSystemPrompt = systemPrompt.trim();
  const payload: ChatRequestPayload = {
    messages: messages.map(({ role, content }) => ({
      role,
      content,
    })),
  };

  // systemPrompt 允许清空，但请求里只有非空时才传，避免命中后端的最小长度校验。
  if (normalizedSystemPrompt) {
    payload.systemPrompt = normalizedSystemPrompt;
  }

  return payload;
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage(
      "assistant",
      "这里先接的是最小聊天页面。你现在发消息，会直接调用后端的 /api/chat/completions。",
    ),
  ]);
  const [draft, setDraft] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [latestRequestPayload, setLatestRequestPayload] =
    useState<ChatRequestPayload | null>(null);
  const [latestResponsePayload, setLatestResponsePayload] = useState<
    ChatCompletionResponse | ApiErrorResponse | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const nextDraft = draft.trim();

    if (!nextDraft || isSubmitting) {
      return;
    }

    const userMessage = createMessage("user", nextDraft);
    const nextMessages = [...messages, userMessage];
    const payload = buildChatRequestPayload(nextMessages, systemPrompt);

    setMessages(nextMessages);
    setLatestRequestPayload(payload);
    setDraft("");
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as
        | ChatCompletionResponse
        | ApiErrorResponse;

      setLatestResponsePayload(result);

      if (!response.ok || !result.ok) {
        const message =
          result.ok === false
            ? result.error.message
            : "聊天请求失败，请稍后再试。";

        setErrorMessage(message);
        return;
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage("assistant", result.output.content),
      ]);
    } catch (error) {
      setLatestResponsePayload(null);
      const message =
        error instanceof Error ? error.message : "请求失败，请检查后端是否启动。";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="hero-kicker">AI Ticket Copilot</p>
        <h1>先把最小前后端聊天链路跑通。</h1>
        <p className="hero-copy">
          当前页面只做一件事：把你的消息发给后端的
          <code>/api/chat/completions</code>，再把结果展示出来。先把这条链路跑通，后面再补会话、工具调用和知识库。
        </p>
        <div className="hero-meta">
          <span>前端：React 19 + Vite</span>
          <span>后端：Express 5</span>
          <span>模型入口：GLM Provider</span>
        </div>

        <div className="debug-panels">
          <div className="payload-panel">
            <div className="payload-panel__header">
              <p className="chat-panel__label">最近一次请求</p>
              <span className="payload-panel__badge">POST /api/chat/completions</span>
            </div>
            <pre className="payload-panel__code">
              {latestRequestPayload
                ? JSON.stringify(latestRequestPayload, null, 2)
                : `{\n  "systemPrompt": "请先发送一条消息",\n  "messages": []\n}`}
            </pre>
          </div>

          <div className="payload-panel">
            <div className="payload-panel__header">
              <p className="chat-panel__label">最近一次响应</p>
              <span className="payload-panel__badge">200 / 4xx / 5xx</span>
            </div>
            <pre className="payload-panel__code">
              {latestResponsePayload
                ? JSON.stringify(latestResponsePayload, null, 2)
                : `{\n  "ok": true,\n  "output": {\n    "role": "assistant",\n    "content": "发送消息后会在这里看到完整响应"\n  }\n}`}
            </pre>
          </div>
        </div>
      </section>

      <section className="chat-panel">
        <div className="chat-panel__header">
          <div>
            <p className="chat-panel__label">最小聊天页面</p>
            <h2>当前消息数：{messages.length}</h2>
          </div>
          <span className={isSubmitting ? "status status--busy" : "status"}>
            {isSubmitting ? "正在请求后端" : "本地页面已就绪"}
          </span>
        </div>

        <div className="message-list" aria-live="polite">
          {messages.length > 0 ? (
            messages.map((message) => (
              <article
                key={message.id}
                className={`message-card message-card--${message.role}`}
              >
                <p className="message-card__role">
                  {message.role === "user" ? "你" : "Copilot"}
                </p>
                <p className="message-card__content">{message.content}</p>
              </article>
            ))
          ) : (
            <p className="empty-state">还没有消息，可以先问一个开发问题。</p>
          )}
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <div className="composer__section">
            <div className="composer__subheader">
              <label className="composer__label" htmlFor="system-prompt">
                System Prompt
              </label>
              <button
                className="composer__secondary"
                type="button"
                onClick={() => setSystemPrompt(DEFAULT_SYSTEM_PROMPT)}
              >
                恢复默认
              </button>
            </div>
            <textarea
              id="system-prompt"
              className="composer__input composer__input--prompt"
              value={systemPrompt}
              onChange={(event) => setSystemPrompt(event.target.value)}
              placeholder="输入当前会附带给模型的系统提示词"
              rows={3}
            />
            <p className="composer__hint">
              这里改的是整条聊天请求的系统提示词。现在你已经可以直接观察它如何进入后端 payload。
            </p>
          </div>

          <label className="composer__label" htmlFor="message">
            输入消息
          </label>
          <textarea
            id="message"
            className="composer__input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="例如：这个项目下一步应该做什么？"
            rows={4}
          />

          <div className="composer__footer">
            <p className="composer__hint">
              现在 system prompt 来自上面的输入框，不再是前端写死常量。
            </p>
            <button className="composer__submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "发送中..." : "发送消息"}
            </button>
          </div>

          {errorMessage ? <p className="composer__error">{errorMessage}</p> : null}
        </form>
      </section>
    </main>
  );
}
