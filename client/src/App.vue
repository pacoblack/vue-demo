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
import Login from './views/Login.vue';

export default defineComponent({
  name: 'App',
  components: {
    Login
  },
  setup() {
    const message = ref('Loading...');

    onMounted(async () => {
      try {
        const response = await apiClient.get<{ message: string }>('/api/hello');
        message.value = response.message;
      } catch (error) {
        console.error('Error fetching data:', error);
        message.value = 'Failed to load message.';
      }
    });

    return { message };
  }
});
</script>
