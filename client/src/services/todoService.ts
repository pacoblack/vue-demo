import apiClient from '@/api';
import axios from 'axios';
import { ref } from 'vue';

const todos = ref([]);
const newTodoText = ref('');

export const fetchTodos = async () => {
    try {
      const response = await apiClient.get<{ data: string }>('/api/todos');
      todos.value = response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
};

export const addTodo = async () => {
    if (!newTodoText.value.trim()) return;
    try {
        const response = await axios.post('/api/todos', { text: newTodoText.value });
        todos.value.push({ id: response.data.id, text: newTodoText.value, completed: false });
        newTodoText.value = '';
    } catch (error) {
        console.error('Error adding todo:', error);
    }
};

export const updateTodo = async (todo: any) => {
    try {
        await axios.put(`/api/todos/${todo.id}`, { completed: todo.completed });
    } catch (error) {
        console.error('Error updating todo:', error);
    }
};

export const deleteTodo = async (todo: any) => {
    try {
        await axios.delete(`/api/todos/${todo.id}`);
        todos.value = todos.value.filter((t: any) => t.id !== todo.id);
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
};