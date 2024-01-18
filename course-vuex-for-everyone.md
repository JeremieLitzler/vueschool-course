# Vuex for Everyone

## What problem does Vuex solve

When you have a small application, using `emit` and `props` may be sufficient but as an application grows, it will become tidious to manage all the events.

With a global state, it will be simplier and safer to handle the data.

Plus, the state is more easily debuggable.

## Instance of Vuex

A Vuex instance contains:

- a property `state`, equivalent to the `data` property in a component.
- a property `getters`, equivalent to the `computed` property in a component.
- a property `actions`, equivalent to the `methods` property in a component.

The new thing is the `mutations` property. It is responsible to set and update data.

## `mutations` vs `actions`

See:

- `actions` as the methods to retrieve external data **and call mutations with the data**.
- `mutations` as the methods to update the data contained in the store, **and only that**.

In addition, always make `mutations` as simple as possible, while you could have complex actions.

Any mutation method takes:

- a `state` instance as first parameter
- a `payload` data as a second parameter

## More about `getters`

Any getter method takes:

- a `state` instance as first parameter
- a `getters` array as a second parameter. It corresponds to all existing getters.

In a component, you use simply as the following:

```javascript
  import { computed } from 'vue';
  import store from '@/store/index';
  const products = computed(() => store.getters.availableProducts);
```

## More about `actions`

Any action receives a `context` parameter that allow to access:

- `state`
- `commit`

You can destructure the `context` to use only the `commit`.

## Making the store available globally

Well, if you look at the documentation of Vuex 4, you will see that you need to update:

```javascript
// src/store/index.js
import { createStore } from 'vuex';

export const store = createStore({
  state: {
    data: []
  },
  getters: {
    //getters go here
  },
  actions: {
    //actions go here
  },
  mutations: {
    //mutations go here
  },
});

```

Then import and use the store in the Vue instance:

```javascript
import { createApp } from 'vue';
import { store } from '@/store';
import App from './App.vue';

createApp(App).use(store).mount('#app');
```

Finally, you need to import the `useStore` composable from `vuex` in the components that need it:

```javascript
  //using the Composition API
  import { computed, ref } from 'vue';
  import { useStore } from 'vuex';

  const store = useStore();

  const loading = ref(true);

  store.dispatch("fetchData").then(() => loading.value = false);

  const data = computed(() => store.getters.availableData);
```

## Vuex Mutation History and Vue Devtools

It is really easy to see the mutation history under `DevTools > Vue > Vuex`.

If you have like I had a difficulty to see the mutation, reinstall the Vue.js devtools.

With the tool, you can easily go back and forward in the timeline with a simple click.
