// services/NotificationService.ts
import { createApp, h, ComponentPublicInstance } from 'vue';
import Message from '@/components/Message.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { ConfirmAction } from '@/types'; // 假设你有一个类型文件
import eventBus from '@/services/eventBus';
let app: any;

export function init(appInstance: any) {
  app = appInstance;
}

export function success(message: string, duration: number = 3000) {
  showMessage('success', message, duration);
}

export function error(message: string, duration: number = 3000) {
  showMessage('error', message, duration);
}

function showMessage(type: 'success' | 'error', message: string, duration: number) {
    // 创建一个新的 DOM 元素作为容器
    const container = document.createElement('div');
    document.body.appendChild(container);
  
    // 创建并挂载 Message 组件
    const messageComponent = createApp(Message, {
      type,
      message,
      duration,
    });
  
    const vm = messageComponent.mount(container);
  
    // 在组件消失后移除 DOM 节点
    setTimeout(() => {
      // vm.unmount();
      container.remove();
    }, duration + 500); // 增加一点时间以确保过渡动画完成
}

function once(eventBus: any, event: string, listener: Function) {
  function wrappedListener(...args: any[]) {
    listener(...args);
    eventBus.off(event, wrappedListener); // 移除监听器
  }
  eventBus.on(event, wrappedListener);
}

export async function confirm(message: string, confirmAction: ConfirmAction) {
  return new Promise<boolean>(async (resolve) => {
    const dialogContainer = document.createElement('div');
    document.body.appendChild(dialogContainer);

    const dialogInstance = createApp(ConfirmDialog, {
      message,
      confirmAction: async () => {
        await confirmAction();
        resolve(true);
      }
    });

    const mountedInstance = dialogInstance.mount(dialogContainer) as ComponentPublicInstance<{
      show: () => void;
      cancel: () => void;
      confirm: () => void;
    }>;

    mountedInstance.show();

    once(eventBus, 'dialog-close', (confirmed: boolean) => {
      dialogContainer.remove();
      resolve(confirmed);
    })
  });
}