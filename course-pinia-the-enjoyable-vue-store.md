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
