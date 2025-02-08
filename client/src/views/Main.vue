<template>
  <el-container class="main-layout">
    <!-- 左侧菜单栏 -->
    <el-aside  ref="aside" :style="{ width: asideWidth + 'px', height: asideHeight + 'px' }" class="resizable-aside">
      <div class="header-placeholder"></div>
      <!-- 菜单内容 -->
      <el-menu  v-if="!isCollapse"  default-active="1" class="el-menu-vertical-demo" :collapse="isCollapse" @select="handleSelect">
        <el-sub-menu v-for="(menu, index) in menus" :key="index" :index="`${index + 1}`">
          <template #title>
            <span>{{ menu.title }}</span>
          </template>
          <el-menu-item v-for="(submenu, subIndex) in menu.submenus" :key="subIndex" :index="`${index + 1}-${subIndex + 1}`">{{ submenu }}</el-menu-item>
        </el-sub-menu>
      </el-menu>
      <!-- 收起后的图标 -->
      <div v-if="isCollapse" class="collapsed-icon">
        <div v-for="(menu, index) in menus" :key="index" :class="['circle-icon', `circle-${index}`]" :style="{ backgroundColor: getRandomColor(index) }">
          <span>{{ getFirstChar(menu.title) }}</span>
        </div>
      </div>
      <!-- 切换按钮 -->
      <div class="toggle-button-container">
        <button class="toggle-button" @click="toggleMenu">
          <i :class="['el-icon-arrow-left', { 'collapsed': isCollapse }]"></i>
        </button>
      </div>

    </el-aside>

    <!-- 右侧内容区 -->
    <el-container>
      <el-header>
        <div style="float:right;">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              用户名<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item icon="el-icon-edit">编辑</el-dropdown-item>
                <el-dropdown-item icon="el-icon-setting">设置</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import eventBus from '@/services/eventBus';
import {
  ElContainer,
  ElAside,
  ElHeader,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElSubMenu,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem
} from 'element-plus';

export default defineComponent({
  components: {
    ElContainer,
    ElAside,
    ElHeader,
    ElMain,
    ElMenu,
    ElMenuItem,
    ElSubMenu,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
  },
  setup() {
    const isCollapse = ref(false);
    const selectedMenu = ref('请选择一个菜单');
    const asideWidth = ref(200); // 默认宽度
    const minAsideWidth = ref(60); // 最小宽度
    const placeholderColor = ref('#409EFF'); // 默认背景颜色
    const placeholderImage = ref(''); // 默认背景图片
    const asideHeight = ref(window.innerHeight - 60); // 减去 header 高度

    const menus = ref([
      { title: '菜单1', submenus: ['子菜单1-1', '子菜单1-2'] },
      { title: '菜单2', submenus: ['子菜单2-1', '子菜单2-2'] },
    ]);

    // 存储每个菜单项的背景颜色
    const colors = ref<string[]>([]);

   const toggleMenu = () => {
      isCollapse.value = !isCollapse.value;
      if (isCollapse.value) {
        asideWidth.value = minAsideWidth.value;
      } else {
        asideWidth.value = 200; // 恢复默认宽度
      }
    };
    const handleSelect = (index: string) => {
      const menuName = getMenuName(index);
      emitUpdateSelectedMenu(menuName);
    };

    const getMenuName = (index: string): string => {
      const [menuIndex, submenuIndex] = index.split('-').map(Number);
      if (submenuIndex) {
        return menus.value[menuIndex - 1].submenus[submenuIndex - 1];
      }
      return menus.value[menuIndex - 1].title;
    };

    const emitUpdateSelectedMenu = (menuName: string) => {
      eventBus.emit('update:selectedMenu', menuName);
    };

     const getFirstChar = (title: string): string => {
      return title.charAt(0);
    };

    const getRandomColor = (index: number): string => {
      if (!colors.value[index]) {
        const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        colors.value[index] = randomColor;
      }
      return colors.value[index];
    };

    return {
      isCollapse,
      toggleMenu,
      handleSelect,
      selectedMenu,
      asideHeight,
      asideWidth,
      menus,
      getFirstChar,
      getRandomColor,
    };
  }
});
</script>

<style>
.main-layout .el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  position: relative; /* 添加相对定位 */
}
.header-placeholder{
  height: 60px;
  background: #B3C0D1;
}

.main-layout .el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-dropdown-link {
  cursor: pointer;
}

.collapsed-icons {
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 垂直对齐顶部 */
  align-items: center; /* 水平居中 */
  height: calc(100% - 60px); /* 减去占位组件的高度 */
  padding-top: 20px; /* 上内边距 */
  box-sizing: border-box;
}

.circle-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px; /* 圆形图标之间的间距 */
}

/* 收起按钮容器 */
.toggle-button-container {
  display: flex;
  justify-content: flex-end; /* 将按钮对齐到右侧 */
  align-items: center; /* 垂直居中 */
  bottom: 20px; /* 距离底部的距离 */
  right: 10px; /* 距离右侧的距离 */
  width: 100%; /* 占满整个宽度 */
  padding-right: 10px; /* 添加一些内边距以避免按钮紧贴边缘 */
}

.toggle-button {
  background-color: white;
  border: none;
  cursor: pointer;
  padding: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  z-index: 1000; /* 确保按钮在最上层 */
}

.toggle-button.collapsed {
  transform: rotate(180deg); /* 切换图标方向 */
}
</style>