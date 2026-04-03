import { getDatabase } from "../infra/database";

interface SaveChatTurnInput {
  sessionId: string;
  userMessage: string;
  assistantMessage: string;
}

const database = getDatabase();

const insertSessionStatement = database.prepare(`
  INSERT OR IGNORE INTO chat_sessions (id, created_at, updated_at)
  VALUES (@id, @createdAt, @updatedAt)
`);

const updateSessionStatement = database.prepare(`
  UPDATE chat_sessions
  SET updated_at = @updatedAt
  WHERE id = @id
`);

const insertMessageStatement = database.prepare(`
  INSERT INTO chat_messages (id, session_id, role, content, created_at)
  VALUES (@id, @sessionId, @role, @content, @createdAt)
`);

function ensureSession(sessionId: string, timestamp: string) {
  insertSessionStatement.run({
    id: sessionId,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  updateSessionStatement.run({
    id: sessionId,
    updatedAt: timestamp,
  });
}

export function saveChatTurn(input: SaveChatTurnInput) {
  const timestamp = new Date().toISOString();

  ensureSession(input.sessionId, timestamp);

  insertMessageStatement.run({
    id: crypto.randomUUID(),
    sessionId: input.sessionId,
    role: "user",
    content: input.userMessage,
    createdAt: timestamp,
  });

  insertMessageStatement.run({
    id: crypto.randomUUID(),
    sessionId: input.sessionId,
    role: "assistant",
    content: input.assistantMessage,
    createdAt: timestamp,
  });
}
