import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import clickCloseDirective from './directives/click-close';

createApp(App).directive('close', clickCloseDirective).mount('#app');
