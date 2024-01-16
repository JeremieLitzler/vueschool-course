import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import './assets/main.css';

import router from './router/index';
import AppLinkVue from './components/AppLink.vue';
import App from './App.vue';

createApp(App).component('AppLink', AppLinkVue).use(router).mount('#app');
