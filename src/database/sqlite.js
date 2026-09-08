import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";

const databaseDir = "./database";

if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, {
    recursive: true
  });
}

const dbPath =
  path.join(databaseDir, "users.db");

export const db =
  new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT DEFAULT 'User',
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    coin INTEGER DEFAULT 0,
    premium INTEGER DEFAULT 0,
    premium_expired_at INTEGER DEFAULT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )
`);

export function closeDatabase() {
  if (db.isOpen) {
    db.close();
  }
}
