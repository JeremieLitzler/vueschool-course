import { createApp } from "vue";
import store from "@/store";
import router from "./router";

import App from "./App.vue";

const forumApp = createApp(App);
// Configure the App below before you mount it...

const requireComponent = require.context(
  // The relative path of the components folder
  "./components",
  // Whether or not to look in subfolders
  false,
  // The regular expression used to match base component filenames
  /App[A-Z]\w+\.(vue|js)$/
);

requireComponent.keys().forEach((fileName) => {
  // Get component config
  const componentConfig = requireComponent(fileName);

  //The following supposes the file name is PascalCased
  //as the official Style Guide tells us.
  const componentName =
    // Gets the file name regardless of folder depth
    fileName.split("/").pop()?.replace(".vue", "");

  // Register component globally
  forumApp.component(
    componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  );
});

// or use  a plugin...
// forumApp.use(SomePlugin)
forumApp.use(router);
forumApp.use(store);
// Mount to the DOM the Vue app
forumApp.mount("#app");

// If needed, you add in Vue 3 only more than one Vue app in the same project, providing that you mount each app to its own rootContainer
// For example:
// const anotherForumApp = createApp(App)
// anotherForumApp.use(SomePlugin)
// anotherForumApp.mount('#another-app')
