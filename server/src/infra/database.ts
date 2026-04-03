import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";

import { getEnv } from "../env";

const { dbPath } = getEnv();

mkdirSync(dirname(dbPath), { recursive: true });

const database = new Database(dbPath);

database.pragma("journal_mode = WAL");

database.exec(`
  CREATE TABLE IF NOT EXISTS chat_sessions (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(session_id) REFERENCES chat_sessions(id)
  );

  CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id
  ON chat_messages(session_id);
`);

export function getDatabase() {
  return database;
}
