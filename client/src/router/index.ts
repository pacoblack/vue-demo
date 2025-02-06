import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Main from '../views/Main.vue';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Main,
    meta: { requiresAuth: true }, // 添加元信息，表示需要认证
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 使用 import.meta.env 访问环境变量
  routes
});

// 路由守卫，用于检查用户是否已登录
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('authToken'); // 假设我们使用localStorage存储token
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;