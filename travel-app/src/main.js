import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import './assets/main.css';

import router from './router/index';

import App from './App.vue';

createApp(App).use(router).mount('#app');
