import '@/assets/css/base.css';
import '@/assets/css/style.css';
import '@/assets/css/main.css';

import { createApp } from 'vue';

import App from '@/App.vue';
import router from '@/router';
import pinia from '@/stores/pinia';
import ClickOutsideDirective from '@/plugins/ClickOutsideDirective';
import firebaseService from '@/services/firebaseService';
import { useUserStore } from '@/stores/UserStore';
import PageScrollDirective from '@/plugins/PageScrollDirective';

//Firebase common logic
firebaseService().auth.onAuthStateChanged(async (user) => {
  if (user) {
    await useUserStore().fetchAuthUser();
  }
});
const app = createApp(App);

//Inspired by https://zerotomastery.io/blog/how-to-auto-register-components-for-vue-with-vite/
const componentFiles = import.meta.glob('@/components/App*.vue', {
  eager: true,
});
//console.log(componentFiles);
const componentFilesEntries = Object.entries(componentFiles);

for (const [componentPath, moduleImport] of componentFilesEntries) {
  //console.log('componentPath', componentPath);
  //console.log('type of dynamicImport', typeof moduleImport);
  //console.log('keys of dynamicImport', Object.keys(moduleImport));
  //console.log('type of dynamicImport.default', typeof moduleImport.default);
  //console.log('keys of dynamicImport', Object.keys(moduleImport.default));
  //The following supposes the file name is PascalCased
  //as the official Style Guide tells us.
  const componentName: string | undefined = componentPath
    .split('/')
    .pop()
    ?.replace('.vue', '');

  if (!componentName) {
    console.warn(
      `The componentName couldn't be extracted from path > ${componentPath} `
    );
    continue;
  }
  /* 
    eslint complains about moduleImport because it is unknown
    From https://github.com/vitejs/vite/discussions/14869, 

  */

  /* eslint-disable */
  app.component(
    componentName!,
    (moduleImport as ModuleImportInterface).default
  );
  /* eslint-enable */
  console.info(`Registered component <${componentName!}> globally.`);
}

app.use(pinia);
app.use(router);
app.use(ClickOutsideDirective);
app.use(PageScrollDirective);

app.mount('#app');
