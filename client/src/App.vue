<template>
  <div id="app">
    <h1>{{ message }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import apiClient from './api';

export default defineComponent({
  name: 'App',
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
