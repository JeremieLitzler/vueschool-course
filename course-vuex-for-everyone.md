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

If you ever need to pass to a getter a parameter other than `state` or `getters`, you will need to return a function.

For example:

- in the the store, you declare such getter:

```javascript
    isProductInStock() {
      return (product) => product.inventory > 0;
    },
```

- in the component script, you add a computed property:

```javascript
//using Composition API
const isProductInStock = computed(() => store.getters.isProductInStock);
```

- and in the component template, you pass the object or data the getter needs via the computed variable:

```htm
<button
    @click="addProductToCart(product)"
    :disabled="!isProductInStock(product)"
>
    Add to cart
</button>
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

## Vuex Map Helpers

The advantage of vuex map helpers is to make the code less verbose:

```javascript
  import { computed } from 'vue';

  const products = computed(() => store.state.products);

  const isProductInStock = computed(() => store.getters.isProductInStock);
  const productInventoryMessage = computed(() => store.getters.productInventoryMessage);
```

versus

```javascript
  import { mapState, mapGetters } from '@/store/mapState'

  const { products } = mapState();

  const { isProductInStock, productInventoryMessage } = mapGetters();

```

The code above is using Composition API and the helper library suggested by [Markus Kottländer](https://stackoverflow.com/users/2560696/markus-kottl%c3%a4nder) on this [Stackoverflow thread](https://stackoverflow.com/a/68653980).

With the Option API, you can use the `mapState`, `mapActions` and `mapGetters` from the `vuex` package and achieve a similar result.

See [this commit](https://github.com/vueschool/learn-vuex/commit/34f07edcc470f616ed92a13a332fd1a6993b30fc) from [the lesson "Vuex Map Helpers
"](https://vueschool.io/lessons/vuex-mapping-state-mutations-getters-and-actions) on [the course "Vuex for Everyone"](https://vueschool.io/courses/vuex-for-everyone).

## Split Vuex Store in Multiple Files

It comes a time when a store can be big. Using the split pattern, you can extract state, getters, actions and mutations to a distinct file.

## Vuex modules

To organize a state, you can go further than multiple files using modules.

In the end, the store folder would look this:

```txt
src
    |_ store
        |_ index.js
        |_ state.js
        |_ getters.js
        |_ actions.js
        |_ mutations.js
        |_ modules
            |_ firstModule.js
            |_ secondModule.js
```

You could also extract the `state`,`getters`, `actions` and `mutations` to separate files in a `firstModule` folder.

An advice: do not use `createStore` in the modules. Simply `export default { ... }`. That module object contains the same properties as the root state:

```javascript
export default {
  namescaped: true,
  state: {
      //state properties go here
  },
  getters {
      //getters go here
  },
  actions: {
      // etc...
  },
  mutations,
  strict: true,
}
```

It is good practice to use `namescaped` to avoid name collisions.

### Call an action of module X within an action of module Y

Simply, tell the action of module Y that the action is in the `rootGetters` object:

```javascript
    methodOfModuleY(
      { state, commit, getters, rootState, rootGetters },
      payload,
    ) {
      commit('mutationOfModuleY', true);

      if (!rootGetters['moduleX/methodToCall'](payload)) {
        // do something...
      }
    }
```

Another way is the following: simply, tell the action of module Y that the mutation is in at the root.

```javascript
    methodOfModuleY(
      { state, commit, dispatch },
      payload,
    ) {
        //set payload to null if none
        dispatch('moduleX/anotherMethod', payload, { root: true });
    }
```

### Call a mutation of module X within an action module Y

Simply, tell the action of module Y that the mutation is in at the root:

```javascript
    methodOfModuleY(
      { state, commit, dispatch },
      payload,
    ) {
        //set payload to null if none
         commit('moduleX/aMutationInX', payload, { root: true });
    }
```

### From the components

#### Using the Options API

You will have the `mapState`, `mapGetters`, `mapActions` and `mapMutations` available.

Using the spread operator, you get access to the properties or methods using different syntax:

```javascript
...mapGetters({
    getterX1: "moduleX/getter1"
    getterY1: "moduleY/getter1"
})
//or
...mapGetters("moduleX", {
    getterX1: "getter1"
    getterX2: "getter2"
})
```

#### With the Composition API

I had more difficulty to figure it out but here how it looks.

Supposing you have a store organized as the following:

```javascript
src
    |_ store
        |_ index.js
        |_ state.js
        |_ getters.js
        |_ actions.js
        |_ mutations.js
        |_ modules
            |_ firstModule.js
                |_ state
                    |_ property1
                    |_ property2
                |_ getters
                    |_ getter1
                    |_ getter2
                |_ actions
                    |_ action1
                    |_ action2
                |_ mutations
            |_ secondModule.js
                |_ state
                |_ getters
                    |_ getter1
                    |_ getter2
                |_ actions
                    |_ action1
                    |_ action2
                |_ mutations

```

You can use it this way using the `mapStore` helper library suggested by [Markus Kottländer](https://stackoverflow.com/users/2560696/markus-kottl%c3%a4nder) on this [Stackoverflow thread](https://stackoverflow.com/a/68653980):

```javascript
import { useStore } from 'vuex';
import { mapGetters } from '@/store/mapStore'

const { ["moduleX/getter1"]: getterX1, ["moduleX/getter2"]: getterX2, ["moduleY/getter1"]: getterY1 } = mapGetters();

const actionY1 = (payload) => {
      store.dispatch('moduleY/action1', payload);
    }

```

So in the end, only the mapGetters are really needed in the helper library, in my experience.

Also, if you find yourself wanting to use `mapState` from that library, tell me how you make it work when using namescaped modules. I used a getter to access for example `moduleX.state.property1`.

## Conclusion

I hope you learn a lot on Vuex.

At the time of writing this article, Vuex has been replaced by Pinia and [VueSchool have a course](https://vueschool.io/courses/pinia-the-enjoyable-vue-store) on the new recommended state management of Vue.

Stay tuned for the notes of that course!
