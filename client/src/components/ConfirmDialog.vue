<!-- components/ConfirmDialog.vue -->
<template>
  <transition name="fade">
    <div v-if="visible" class="dialog-overlay" @click.self="cancel">
      <div class="dialog" @click.stop>
        <header class="dialog-header">
          <slot name="header">{{ title }}</slot>
        </header>
        <section class="dialog-body">
          <slot>{{ message }}</slot>
        </section>
        <footer class="dialog-footer">
          <button @click="confirm">{{ confirmText }}</button>
          <button @click="cancel">{{ cancelText }}</button>
        </footer>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { ConfirmAction } from '@/types'; 
import eventBus from '@/services/eventBus';

export default defineComponent({
  props: {
    message: {
      type: String,
      required: true
    },
    confirmAction: {
      type: Function as () => ConfirmAction,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: "标题"
    },
    confirmText: {
      type: String,
      required: false,
      default: "确定"
    },
    cancelText: {
      type: String,
      required: false,
      default: '取消'
    }
  },
  setup(props, { emit }) {
    const visible = ref(false);

    function show() {
      visible.value = true;
    }

    function cancel() {
      visible.value = false;
      eventBus.emit('dialog-close', false);
    }

    function confirm() {
      props.confirmAction();
      visible.value = false;
      eventBus.emit('dialog-close', true);
    }

    return {
      visible,
      show,
      cancel,
      confirm
    };
  }
});
</script>

<style scoped>
:root {
  --dialog-bg-color: white;
  --dialog-text-color: black;
  --dialog-shadow-color: rgba(0, 0, 0, 0.2);
}

@media (prefers-color-scheme: dark) {
  :root {
    --dialog-bg-color: #1e1e1e; /* 深色模式下的背景色 */
    --dialog-text-color: white; /* 深色模式下的字体颜色 */
    --dialog-shadow-color: rgba(255, 255, 255, 0.1); /* 深色模式下的阴影颜色 */
  }
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* 背景遮罩颜色 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9998;
}

.dialog {
  background-color: var(--dialog-bg-color); /* 对话框背景色 */
  color: var(--dialog-text-color); /* 对话框内文本颜色 */
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--dialog-shadow-color);
  width: 300px;
  max-width: 90%;
  z-index: 9999;
  overflow: hidden;
}

.dialog-header,
.dialog-footer {
  padding: 15px;
  background-color: var(--dialog-bg-color); /* 对话框头部和底部背景色 */
  color: var(--dialog-text-color); /* 对话框头部和底部文本颜色 */
}

.dialog-header {
  font-size: 1.1em;
  font-weight: bold;
}

.dialog-body {
  padding: 15px;
  color: var(--dialog-text-color); /* 对话框主体文本颜色 */
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
}

button {
  background-color: transparent;
  border: 1px solid var(--dialog-text-color); /* 按钮边框颜色 */
  color: var(--dialog-text-color); /* 按钮文本颜色 */
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: var(--dialog-text-color); /* 悬停时按钮背景色 */
  color: var(--dialog-bg-color); /* 悬停时按钮文本颜色 */
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