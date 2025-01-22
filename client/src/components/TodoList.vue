<template>
  <div class="todo-list">
    <h2>{{ title }}</h2>
    <form @submit.prevent="addTodo">
      <input v-model="newTodoText" type="text" placeholder="Add a new todo" />
      <button type="submit">Add</button>
    </form>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <input type="checkbox" v-model="todo.completed" @change="updateTodo(todo)" />
        {{ todo.text }}
        <button @click="deleteTodo(todo)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import apiClient from '../api'; // 导入封装的API客户端

export default defineComponent({
  name: 'TodoList',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup() {
    const newTodoText = ref('');
    const todos = ref([]);

    const fetchTodos = async () => {
      try {
        const response = await apiClient.get('/api/todos');
        todos.value = response;
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    const addTodo = async () => {
      if (!newTodoText.value.trim()) return;
      try {
        const response = await apiClient.post('/api/todos', { text: newTodoText.value });
        todos.value.push({ id: response.id, text: newTodoText.value, completed: false });
        newTodoText.value = '';
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    };

    const updateTodo = async (todo: any) => {
      try {
        await apiClient.put(`/api/todos/${todo.id}`, { completed: todo.completed });
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    };

    const deleteTodo = async (todo: any) => {
      try {
        await apiClient.delete(`/api/todos/${todo.id}`);
        todos.value = todos.value.filter((t: any) => t.id !== todo.id);
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    };

    onMounted(() => {
      fetchTodos();
    });

    return { newTodoText, todos, addTodo, updateTodo, deleteTodo };
  },
});
</script>

<style scoped>
.todo-list {
  text-align: center;
  margin-top: 50px;
}
</style>