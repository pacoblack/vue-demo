<template>
  <div >
    <!-- <h1>{{ message }}</h1>
    <h5>{{ time }}</h5>
    <main>
      <Login title='login' />
    </main> -->
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import apiClient from './api';
import Login from './views/Login.vue';
import {sayHello} from '@/api/login.ts'

export default defineComponent({
  name: 'App',
  components: {
    Login
  },
  setup() {
    const message = ref('Loading...');
    const time = ref('')

    function sayHelloFunc(){
      sayHello().then (response => {
        message.value = response.message;
        time.value = response.time;
      }).catch(error => {
        console.error('Error fetching data:', error);
        message.value = 'Failed to load message.';
      })
    }

    onMounted(async () => {
      sayHelloFunc()
    });

    return { message, time };
  }
});
</script>
