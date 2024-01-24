# Pinia: The Enjoyable Vue Store

## Why Pinia

Before Pinia, we use Vuex.

The creator of Vue Router built Pinia to make state management even easier than Vuex did.

In fact, Pinia is:

- more intuitive, requiring less boilerplate code
- type safe
- supported by DevTools
- extendable with plugins
- modular by default with code splitting out-of-the-box.
- extremely lightweight.

Here is [the documentation](https://pinia.vuejs.org/).

## When do you add Pinia to a project

The answer is often subjective.

Daniel Kelly decides with the following checklist:

- Does the project contain 5 to 10 components?
- Is the project needing a state?
- Is the project a demo?

If you answer to one of these, then Pinia is not necessary.

Remember, you can use `props` and `emit` to pass data from a components to another.

If you use a state management, do it at the start as refactoring may take quite a bit time.

## Pinia is modular by default

When Vuex was modular by options, Pinia is modular from the start.

## Creating a Pinia store

To create a store, you need:

- to import `defineStore` from `pinia`.
- to pick a unique name for the store in the application.

Finally, exporting a store to be used is very similar to composables as you will name it `useStoreName("StoreName", { /* store options */})`.

That gives you:

```javascript
import { defineStore } from 'pinia';

export const useProductStore = defineStore('ProductStore', {
  //state
  //actions
  //getters
});
```

## Define the options

### The `state`

It is done differently to Vuex, where it was an object. With Pinia, it is a function, so it can be used on client and server-side:

```javascript
  state: () => {
    return {};
  },
```

## Usage in the components

It is a simple as composables:

```javascript
  import { useProductStore } from "./stores/ProductStore";
  //This is a must to make destructured properties of the store reactive.
  import {storeToRefs} from "pinia";
  const { products } = storeToRefs(useProductStore());
```

## Making a Pinia action asynchronous

```javascript
actions: {
    async fill() {
      //This is a dynamic import, therefore you need to use the ".default" to access the data
      this.products = (await import('@/data/products.json')).default;
    },
  },
```

## Patching mutations

Patching allows to group several identical mutations into one.

```javascript
    cartStore.$patch(state => {
      for (let index = 0; index < count; index++) {
        state.items.push(product);
      }
    });
```

However, it is better to use an action that calls the implicite mutations, just like with Vuex.

It reduces the amount of places where the state is updated and if it comes from one player, the actions, debogging will be easier.

```javascript
  //in the store.js file...
  actions: {
    addToCart(count, product) {
      count = parseInt(count);
      console.log('count is', count);
      for (let index = 0; index < count; index++) {
        this.items.push(product);
       }
    },
  },
```

Doing so remove the need to use `$patch` and it shows a clear mutation timeline with a start and end event showing the action call.

## Local vs Global state

When data is used,

- in a component context,
- in limited scenario (a single click of button, even if it repeated),

Storing that data in the global state isn't necessary.

If the data is bubbling up only one level up, it isn't necessary as well.

Also, if other components don't mutate the data but use it, props are sufficient.

## Getters with Pinia

Just like Vuex, `getters` is synonymous with `computed` variables.

So in the store, you declare:

```javascript
  getters: {
    count() {
      return this.items.length;
    },
  },
```

And in the component, you use the getter like so:

```htm
<script setup>
  import { useCartStore } from "../stores/CartStore";
  const cartStore = useCartStore();

</script>
<template>
  <div class="cart-count absolute">{{ cartStore.count }}</div>
</template>
```

NB: since that `this` in a store reference to the instance of the state, then, don't declare your getters as an arrow fucntion. Unless... you use the the following:

```javascript
  getters: {
    count: (state) => state.items.length,
    },
  },
```

Finally, just like Vuex, you can call a getter with parameters: we call that Dynamic Getters.

You need to return a function in the getter definition to access the parameters:

```javascript
    groupCount: (state) => (name) => state.groupedItems[name].length,
```

In the component, it is used like this:

```javascript
          <CartItem
            v-for="(items, name) in cartStore.groupedItems"
            :key="name"
            :product="items[0]"
            :count="store.groupCount(name)"
          />

```

## Using a store in another store

It is exactly the same as in the template:

```javascript
import { useAuthUserStore } from './AuthUserStore';

export const useCartStore = defineStore('CartStore', {
  //... down in the actions...
      checkout() {
      const authUserStore = useAuthUserStore();
      alert(
        `${authUserStore.username} just bought ${this.count} items at a total of $${this.total}`,
      );
    },
}
```

## Using in Pinia with the Options API

### Accessing the state

See [this commit](https://github.com/vueschool/pinia-the-enjoyable-vue-store/commit/9fb923bbee82714318038c31ee3e4ef41e74e8fd) for using helper functions `mapState` and `mapWritableState`.

`mapState` is used in the `computed` options and make the data readonly. It is the contrary for `mapWritableState`.

### Accessing the getters

You can use the `mapState` helper function.

Of course, using `mapWritableState` isn't going to do anything.

### Accessing the actions

Using the helper function `mapActions`, you simply provide the store and the name of the action:

```htm
<script>
// imports
import { useAuthUserStore } from "@/stores/AuthUserStore";
import { mapState, mapActions } from "pinia";

export default {
  computed: {
    ...mapState(useAuthUserStore, {
      user: "username",
    }),
  },
  methods: {
    ...mapActions(useAuthUserStore,
    //using an object is nicer to customize the name of the action in the template
    {
      toTwitter: "visitTwitterProfile",
    }),
  },
};
</script>

<template>
  <span class="mr-5" @click="toTwitter">{{ user }}</span>
</template>
```

## Preserve State with Hot Module Replacement

You will need to use `acceptHMR` from `pinia` package and add the following at the end of each store:

```javascript
import { defineStore, acceptHMRUpdate } from 'pinia';
// use the following on each store by updating 'useMyStore'
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMyStore, import.meta.hot));
}
```

## Subscribing to Actions

When you call an action and you want to another action triggered, you can do so using the `$onAction` hook:

```javascript
/**
    name is the name of the action
    store is the store instance, same as `someStore`
    args is thearray of parameters passed to the action
    after is the hook after the action returns or resolves
    onError is the hook if the action throws or rejects
 */
  cartStore.$onAction(({name, store, args, after, onError }) => {
    if (name === "addToCart"){
      after(() => {
        console.log("onAction", args[0]);
      });
      onError((err) => {
        console.error("onError", err);
      })
    }
  })
```

### What are potential usecases of subscribing to actions

- Showing notifications to the user once the action has completed.
- Recording analytic data
- Saving errors to Sentry

Read [more in the docs](https://pinia.vuejs.org/core-concepts/actions.html#Subscribing-to-actions).

## Subscribe to the State

It is possible using `$subscribe` function:

```javascript
  cartStore.$subscribe((mutation, state) => {

  })
```

### What are potential usecases of subscribing to state

- Undo or Redo functionnality: see

Read [more in the docs](https://pinia.vuejs.org/core-concepts/state.html#Subscribing-to-the-state)

## Creating a Pinia plugin

To do so, we need to create a javascript file under a `plugins` folder in `src`.

This files contains a function that holds the logic of the plugin. For a Pinia plugin, the function takes a context object providing access to:

- `context.pinia`: the pinia instance created with `createPinia()`
- `context.app`: the current app created with `createApp()` (Vue 3 only)
- `context.store`: the store the plugin is augmenting
- `context.options`: the options object defining the store passed to `defineStore()`

For example, in a plugin providing undo and redo functions, you finish the function by returning the functions into an object.

```javascript
import { ref, reactive } from 'vue';

export function PiniaHistoryPlugin({ pinia, app, store, options }) {
  const cartHistory = reactive([]);
  const futureCart = reactive([]);
  //This is necessary to prevent the $subscribe function to run when we are undoing.
  const doingHistory = ref(false);

  cartHistory.push(JSON.stringify(store.$state));

  const undo = () => {
    //Cannot undo if the history has only the initial value
    if (cartHistory.length === 1) {
      console.log('Nothing to undo...');
      return;
    }

    console.log('Undoing to previous state mutation...');
    doingHistory.value = true;
    futureCart.push(cartHistory.pop());
    store.$state = JSON.parse(cartHistory.at(-1));
    doingHistory.value = false;
  };
  const redo = () => {
    console.log('Redoing to previous state mutation...');
    const latestState = futureCart.pop();
    if (!latestState) {
      console.log('No redo possible because the future is empty...');
      return;
    }
    doingHistory.value = true;
    cartHistory.push(latestState);
    store.$state = JSON.parse(latestState);
    doingHistory.value = false;
  };

  store.$subscribe((mutation, state) => {
    if (!doingHistory.value) {
      cartHistory.push(JSON.stringify(state));
      //reset the futureCart not with [] because it is reactive
      //instead, the splice method clears the items from it.
      futureCart.splice(0, futureCart.length);
    }
  });

  return {
    undo,
    redo,
  };
}
```

To use the plugin, you will need:

- to register it in `main.js`

```javascript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { PiniaHistoryPlugin } from '@/plugins/PiniaHistoryPlugin';

const pinia = createPinia();
pinia.use(PiniaHistoryPlugin);

// Init App
createApp(App)
  .use(pinia)
  .use(FontAwesomePlugin)
  .mount('#app');
```

- to call the methods returned by the plugin as if they were properties of the store. I am pretty sure that, if you needed to pass on parameters to a function, you could simply apply the same technique as the dynamic getters.

If you needed to enable the plugin for certain stores only, you simply add a custom property to the store's options:

```javascript
import { defineStore } from 'pinia';

export const useMyStore = defineStore('MyStore', {
  enabledPlugin: true,
  //state
  state: () => {
    return {
      data: [],
    };
  },
  getters: {
    // ... getters go here
  },
  actions: {
    //... actions go here
  },
});
```

Then use the options' property in the plugin to exist if the property isn't true:

```javascript
import { reactive } from 'vue';

export function MyPiniaPlugin({ pinia, app, store, options }) {
  if (!options.enabledPlugin) return;

  const someData = reactive([]);
  const otherData = reactive([]);

  const method1 = () => {
    // custom logic goes here
  };

  const method2 = () => {
    // custom logic goes here
  };

  store.$subscribe((mutation, state) => {
    // logic to mutate state
  });

  return {
    someData,
    otherData,
    method1,
    method2,
  };
}

```

Read [more in the docs](https://pinia.vuejs.org/core-concepts/plugins.html).

## Use Composables in the Pinia State

You can use composables, either from an external package like VueUse or your own.

In the lesson, Daniel showcased the useLocalStorage composable from VueUse, but on January 24th 2024, I add an error I could resolve.

## Conclusion

What did I learn that is better in Pinia:

- mutations are implicit, which make is easier to use.
- it is built via Composition API in mind
- it is easy to extend
- it is easy to manage undo and redo thanks state subscription.

Thanks to the VueSchool team for the course and the geate examples.
