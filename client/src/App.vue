<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <main>
      <Login title='login' />
      <!-- <TodoList title="My Todos" /> -->
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import apiClient from './api';
import TodoList from './components/TodoList.vue';
import Login from './components/Login.vue';

export default defineComponent({
  name: 'App',
  components: {
    TodoList,
    Login
  },
  setup() {
    const message = ref('Loading...');

    const newTodoText = ref('');
    const todos = ref([]);

    const fetchTodos = async () => {
      try {
        const response = await apiClient.get<{ data: string }>('/api/todos');
        todos.value = response.data;
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    const addTodo = async () => {
      if (!newTodoText.value.trim()) return;
      try {
        const response = await axios.post('/api/todos', { text: newTodoText.value });
        todos.value.push({ id: response.data.id, text: newTodoText.value, completed: false });
        newTodoText.value = '';
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    };

    const updateTodo = async (todo: any) => {
      try {
        await axios.put(`/api/todos/${todo.id}`, { completed: todo.completed });
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    };

    const deleteTodo = async (todo: any) => {
      try {
        await axios.delete(`/api/todos/${todo.id}`);
        todos.value = todos.value.filter((t: any) => t.id !== todo.id);
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    };

    onMounted(async () => {
      try {
        const response = await apiClient.get<{ message: string }>('/api/hello');
        message.value = response.message;
      } catch (error) {
        console.error('Error fetching data:', error);
        message.value = 'Failed to load message.';
      }
      // fetchTodos()
    });


    return { message };
  }
});
</script>
