<template>
  <el-container class="main-layout">
    <!-- 左侧菜单栏 -->
    <el-aside width="200px">
      <div class="header-placeholder"></div>
      <el-menu default-active="1" class="el-menu-vertical-demo" :collapse="isCollapse" @select="handleSelect">
        <el-sub-menu index="1">
          <template #title>
            <span>菜单1</span>
          </template>
          <el-menu-item index="1-1">子菜单1-1</el-menu-item>
          <el-menu-item index="1-2">子菜单1-2</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <span>菜单2</span>
          </template>
          <el-menu-item index="2-1">子菜单2-1</el-menu-item>
          <el-menu-item index="2-2">子菜单2-2</el-menu-item>
        </el-sub-menu>
      </el-menu>
      <button style="color:white" @click="toggleMenu">切换菜单</button>
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

    const toggleMenu = () => {
      isCollapse.value = !isCollapse.value;
    };

    const handleSelect = (index: string) => {
      const menuName = getMenuName(index);
      emitUpdateSelectedMenu(menuName);
    };

    const getMenuName = (index: string): string => {
      switch (index) {
        case '1-1':
          return '子菜单1-1';
        case '1-2':
          return '子菜单1-2';
        case '2-1':
          return '子菜单2-1';
        case '2-2':
          return '子菜单2-2';
        default:
          return '请选择一个菜单';
      }
    };

    const emitUpdateSelectedMenu = (menuName: string) => {
      eventBus.emit('update:selectedMenu', menuName);
    };

    return {
      isCollapse,
      toggleMenu,
      handleSelect,
      selectedMenu,
    };
  }
});
</script>

<style>
.main-layout .el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
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
</style>