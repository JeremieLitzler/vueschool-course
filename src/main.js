import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";

import { routes } from "./router";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const forumApp = createApp(App);
// Configure the App below before you mount it...

// For example to register a global component
// forumApp.component("NiceButton", {});

// or use  a plugin...
// forumApp.use(SomePlugin)
forumApp.use(router);

// Mount to the DOM the Vue app
forumApp.mount("#app");

// If needed, you add in Vue 3 only more than one Vue app in the same project, providing that you mount each app to its own rootContainer
// For example:
// const anotherForumApp = createApp(App)
// anotherForumApp.use(SomePlugin)
// anotherForumApp.mount('#another-app')
