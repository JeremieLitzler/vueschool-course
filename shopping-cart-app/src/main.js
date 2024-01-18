import { createApp } from 'vue';
import vuex from './store/index';

import './style.css';
import App from './App.vue';

createApp(App).use(vuex).mount('#app');
