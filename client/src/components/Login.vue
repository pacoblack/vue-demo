<!-- Login.vue -->
<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="username" type="text" placeholder="Username or Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="email" type="text" placeholder="Email"  />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import apiClient from '../api'; 

export default defineComponent({
  name: 'Login',
  setup() {
    const username = ref('');
    const password = ref('');
    const email = ref('');


    const login = async () => {
      try {
        await apiClient.post('/api/auth/login', { username: username.value, password: password.value, email:email.value});
        // 处理成功登录后的逻辑，比如重定向到主页或设置JWT令牌
      } catch (error) {
        console.error('login failed:', error);
      }
    };

    // const login = async () => {
    //   try {
    //     await apiClient.post('/api/auth/login', { username: username.value, password: password.value });
    //     // 处理成功登录后的逻辑，比如重定向到主页或设置JWT令牌
    //   } catch (error) {
    //     console.error('Login failed:', error);
    //   }
    // };

    return { username, password, login };
  },
});
</script>