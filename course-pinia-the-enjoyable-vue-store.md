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

## Conclusion

What did I learn that is better in Pinia:

- mutations are implicit, which make is easier to use.
-
