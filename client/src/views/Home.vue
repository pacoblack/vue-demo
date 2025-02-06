<template>
  <div>
    <h1>{{ selectedMenu }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import eventBus from '@/services/eventBus';

export default defineComponent({
  setup() {
    const selectedMenu = ref('请选择一个菜单');

    const updateSelectedMenu = (menuName: string) => {
      selectedMenu.value = menuName;
    };

    onMounted(() => {
      // 监听事件总线上的更新菜单名称事件
      eventBus.on('update:selectedMenu', updateSelectedMenu);
    });

    onUnmounted(() => {
      // 移除监听器
      eventBus.off('update:selectedMenu', updateSelectedMenu);
    });

    return {
      selectedMenu,
    };
  }
});
</script>

<style scoped>
h1 {
  font-size: 24px;
  margin-top: 20px;
}
</style>