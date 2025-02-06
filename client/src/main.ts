import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { init } from './services/NotificationService';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App);
init(app);

// 使用 Element Plus
app.use(ElementPlus);

app.use(router).mount('#app');