# VueJS 3 Components Fundamentals

In general, the fundamentals of components doesn't change much.

The module doesn't cover the differences between the Options API versus the Composition API.

We review this in the next modules:

- [Vue.js 3 Fundamentals with the Options API](module-vuejs-3-fundamentals-with-the-options-api.md)
- [Vue.js 3 Fundamentals with the Composition API](module-vuejs-3-fundamentals-with-the-composition-api.md)

## Registration of components

In VueJS 3, it is slighly different than VueJS 2 :

- To register globally, we write:

```javascript
const MyAwesomeComponent = {
  template: '#plan-picker-template',
  data() {
    return {
      someData: ""
    }
  }
};
const app = Vue.createApp({})
  .component('my-component', MyAwesomeComponent)
  .mount('#app');

```

- To register locally, it is the same way as VueJS 2, i.e.:

```javascript
const app = Vue.createApp({
    components: {
        'my-component': MyAwesomeComponent,
    }
})
  .mount('#app');

```
