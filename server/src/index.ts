// server/src/index.ts
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import todosRouter from './routes/todos';
import { initDb } from './db';
import mongoose from 'mongoose';
import { AuthService } from './services/authService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const CLIENT_URL = process.env.CLIENT_URL || '';
app.use(cors());
app.use(express.json());

app.use(helmet());
// app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);

// 初始化数据库
initDb();

// 注册API路由
app.use('/api/todos', todosRouter);

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express!' });
});

// 连接MongoDB
mongoose.connect(process.env.MONGO_URI as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);

// 使用单例模式获取AuthService实例
const authService = AuthService.getInstance();

// 注册路由
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.log('error register', error)
    res.status(500).json({ message: error.message });
  }
});

// 登录路由
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { token } = await authService.login(req.body.username, req.body.password);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.log('error login', error)
    res.status(400).json({ message: error.message });
  }
});

// 受保护的API路由示例
app.get('/api/protected', async (req: Request, res: Response) => {
  try {
    const user = await authService.authenticateToken(req.cookies.token);
    if (!user) throw new Error('Unauthorized');

    res.json({ message: 'This is a protected route', user });
  } catch (error) {
    res.status(error instanceof Error && error.message === 'Unauthorized' ? 401 : 500).json({ message: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));