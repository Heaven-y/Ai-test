import { useState, type SubmitEventHandler } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatCompletionResponse {
  ok: true;
  output: {
    role: "assistant";
    content: string;
  };
}

interface ApiErrorResponse {
  ok: false;
  error: {
    code: string;
    message: string;
  };
}

const SYSTEM_PROMPT = "请用导师口吻回答，并保持简洁、直接。";

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
  };
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage(
      "assistant",
      "这里先接的是最小聊天页面。你现在发消息，会直接调用后端的 /api/chat/completions。",
    ),
  ]);
  const [draft, setDraft] = useState("");
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

    setMessages(nextMessages);
    setDraft("");
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemPrompt: SYSTEM_PROMPT,
          messages: nextMessages.map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      const result = (await response.json()) as
        | ChatCompletionResponse
        | ApiErrorResponse;

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
              当前会附带固定 system prompt，帮助你先观察完整聊天请求的结构。
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
