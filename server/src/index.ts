// server/src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todosRouter from './routes/todos';
import { initDb } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
app.use(cors());
app.use(express.json());

// 初始化数据库
initDb();

// 注册API路由
app.use('/api/todos', todosRouter);

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express!' });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
