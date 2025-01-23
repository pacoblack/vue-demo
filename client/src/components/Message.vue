<!-- components/Message.vue -->
<template>
  <transition name="fade">
    <div v-if="visible" :class="['message', type]" @click="hide">{{ message }}</div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';
import { defineProps } from 'vue';

// 定义 props 类型
interface Props {
  type: 'success' | 'error';
  message: string;
  duration?: number; // 使用可选参数
}

// 解构 props
const props = defineProps<Props>();

const visible = ref(false);

onMounted(() => {
  show();
});

function show() {
  visible.value = true;
  setTimeout(() => {
    hide();
  }, props.duration || 3000); // 确保默认值为3000ms
}

function hide() {
  visible.value = false;
}

// 使用 watchEffect 来确保当 props 变化时重新计时
watchEffect(() => {
  if (visible.value) {
    setTimeout(() => {
      hide();
    }, props.duration || 3000); // 确保默认值为3000ms
  }
});
</script>

<style scoped>
.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 4px;
  color: white;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 9999; /* 确保消息框位于最上层 */
}

.success {
  background-color: #28a745;
}

.error {
  background-color: #dc3545;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>