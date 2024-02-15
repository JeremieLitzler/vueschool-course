import './assets/main.css';
import './style.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

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

app.use(createPinia());
app.use(router);

app.mount('#app');
