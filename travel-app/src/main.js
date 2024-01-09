import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import './style.css';
import App from './App.vue';
import HomeVue from './views/Home.vue';
import AboutVue from './views/About.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    //routes go here
    { path: '/', name: 'Home', component: HomeVue },
    { path: '/about', name: 'About', component: AboutVue },
  ],
});
createApp(App).use(router).mount('#app');
