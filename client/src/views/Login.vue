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
import { defineComponent, ref, onMounted } from 'vue';
import apiClient from '../api'; 
import { success, error, confirm } from '@/services/NotificationService';
import { loginApi, getPublicKeyApi } from '@/api/login.ts'

export default defineComponent({
  name: 'Login',
  setup() {
    const username = ref('');
    const password = ref('');
    const email = ref('');


    const login = async () => {
        loginApi({ username: username.value, password: password.value, email:email.value})
        .then(res => {
          console.log('###', res)
          success('登录成功！');
        }).catch (err => {
          error('登录失败!' + err);
        })
    };

    onMounted(async () => {
      getPublicKeyApi().then(res => {
        console.log("publicKey", res)
      }).catch(err=>{

      })
    })

    return { username, password, login };
  },
});
</script>