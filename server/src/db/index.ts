// server/src/db/index.ts
import path from 'path';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = path.resolve(__dirname, process.env.DB_PATH as string);
const db = new Database(dbPath);

export const initDb = () => {
  // 初始化数据库表
  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0
    )
  `);
};

export const getAllTodos = () => {
  const stmt = db.prepare('SELECT * FROM todos');
  return stmt.all();
};

export const addTodo = (text: string) => {
  const stmt = db.prepare('INSERT INTO todos (text) VALUES (?)');
  const info = stmt.run(text);
  return { id: info.lastInsertRowid };
};

export const updateTodo = (id: number, completed: boolean) => {
  const stmt = db.prepare('UPDATE todos SET completed = ? WHERE id = ?');
  const info = stmt.run(completed ? 1 : 0, id);
  return info.changes > 0;
};

export const deleteTodo = (id: number) => {
  const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
};