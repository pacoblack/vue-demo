// server/src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express!' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
