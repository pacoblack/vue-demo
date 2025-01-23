<!-- Login.vue -->
<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="username" type="text" placeholder="Username or Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import apiClient from '../api'; 
import { success, error, confirm } from '@/services/NotificationService';

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

        // success('登录成功！');
        // error('登录成功！');
        await confirm('您确定要删除吗？', async () => {
          // 执行删除操作的逻辑
          console.log('删除操作执行...');
        });
      } catch (error) {
        console.error('login failed:', error);
      }
    };

    return { username, password, login };
  },
});
</script>