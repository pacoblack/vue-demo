<!-- Login.vue -->
<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="email" type="text" placeholder="Email" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import * as JsRSASign from 'jsrsasign';
import CryptoJS from 'crypto-js';
import apiClient from '../api'; 
import { success, error, confirm } from '@/services/NotificationService';
import { loginApi, getPublicKeyApi } from '@/api/login.ts'
import HybridEncryptUtil from '@/utils/HybridEncryptUtil.ts';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Login',
  data() {
    return {
      username: '' as string,
      password: '' as string,
      publicKey: null as string | null,
      sessionKey: null as Buffer | null,
      iv: null as Buffer | null
    };
  },
  methods: {
    fetchPublicKey() {
       getPublicKeyApi().then(res => {
        console.log('Received public key response:', res); // 添加调试信息
        this.publicKey = res.publicKey
      }).catch(err=>{
        error('Error fetching public key:', err)
      })
    },
    async login(){
      let credentials = { username: this.username, password: this.password, email: this.email }
      const hybridEncryptUtil = new HybridEncryptUtil();
      hybridEncryptUtil.encryptCredentials(credentials, this.publicKey).then(data => {
        console.log("result", data)
        loginApi(data)
        .then(res => {
          console.log('login response', res)
          success('登录成功！');
          localStorage.setItem('authToken', res.token);
          this.$router.push({ name: 'Home' });
        }).catch (err => {
          error('登录失败!' + err);
        })
      }).catch(err => {
        console.log('login response', err)
        error('加密失败!' + err);
      })
      
    }
  },
  mounted(){
    this.fetchPublicKey()
  },
  setup() {
    const username = ref('');
    const password = ref('');
    const email = ref('');
    const router = useRouter();
    return { username, password, email, router };
  },
});
</script>