// server/src/routes/todos.ts
import express from 'express';
import { getAllTodos, addTodo, updateTodo, deleteTodo } from '../db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const todos = await getAllTodos();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', async (req, res) => {
  const { text } = req.body;
  try {
    const todo = await addTodo(text);
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    const success = await updateTodo(Number(id), completed);
    if (!success) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const success = await deleteTodo(Number(id));
    if (!success) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;