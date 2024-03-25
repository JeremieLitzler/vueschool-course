# Common Vue.js Mistakes and How to Avoid Them

The following are a kind of a checklist.

## Don't Omit the Key Directive on v-for

Why? What does the `:key` attribut do?

While it will be OK not to put a `:key` for static elements (e.g. elements that don't contain their own state like `p`, `li`, `span`, `label`), the ones that do contain the own state will not behave properly.

For example, `input` or `textarea` elements or even components with their own state will produce a weird result.

See [the demo of the issue with a key provided](https://youtu.be/tXngJkLsz0U).

Also, if you're using the [Vue Official extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar) and ESLint extension in Visual Studio Code, you will see an error or a warning, depending on your settings.

**ESLint will show you the issue.**

However, it doesn't stop there: having a key that contains a same value for multiple entries in an array will cause the same effect.

So what should and shouldn't the key be?

- not the index in the array
- not the same value of each value

So how do you create unique key?

With a list of objects, you could concatenate 2 properties or `JSON.stringify` the object.

Read more on [this blog post](https://vueschool.io/articles/vuejs-tutorials/tips-and-gotchas-for-using-key-with-v-for-in-vue-js-3/).

## Prop Drilling

It is defined by passing a prop down several level from a component to its `N+2` child or more.

The same is true when component `N+2` emits back...

It is anti-pattern.

How to avoid it?

### 1. use `provide` and `inject`

See [the docs for more details](https://vuejs.org/guide/components/provide-inject.html) or my notes on [the course "Composition API"](course-vue-3-composition-api.md#what-about-passing-variables-from-component-n-to-component-n2-without-using-a-prop-on-component-n1).

That is how VueRouter does it.

### 2. use global state management

A global state doesn't only mean Vuex or Pinia, but a simple composable can work too for simplier use cases.
You will then need to use the composable on each component.

The caveat: set the data of the composable outside of the composable. See [the example](https://github.com/vueschool/common-vue-js-mistakes/commit/897dfacfbeb2306fbfe1e985652a7eaec50522f0).

Otherwise, the data is initialized every time you call the composable.

Read [the docs for more details](https://vuejs.org/guide/scaling-up/state-management.html).

## Watching Arrays the wrong Way

Watching arrays requires to use the deep mode.

```javascript
watch(numbers, () => console.log("new number added"), {
  //deep option
  deep: true,
});
```

Why?

When you add, remove or modify an item in an array, you must use the `deep` option so that Vue is working against a brand new array to spot the difference.

Another syntax is to use an anonymous arrow function:

```javascript
watch(
  () => [...numbers.value],
  () => console.log("new number added")
);
```

**The same applies to objects!**

## Replacing Reactive State the Wrong Way

We cannot replace a whole `reactive` object, **NEVER**.

Use `ref` instead when you replace a reactive variable entirely.

Also, remember: replacing entirely a `reactive` variable's value will break the reactivity...

```javascript
const myData = reactive({ name: "John Doe", age: 36 });
//❌ NEVER  DO THAT
myData = { name: "Jane Doe", age: 34 };
```

It seems that using `reactive` may depreceated someday... or use it wisely! I personally don't use it because I am not bothered by the `.value` you need to use in the script setup.

```javascript
const myData = ref({ name: "John Doe", age: 36 });
// ✅ Reactivity remains enabled
myData.value = { name: "Jane Doe", age: 34 };
```

## Unintentionally Mutating Props

Mutating props means modifying a property of an object _prop_ passed by a component to a child component using `v-model` in the child component.

The effect is that, if the child modifies a property of the object _prop_, the change reflects on the parent component.

Doing the same with a primitive prop would log a warning because props are readonly.

To avoid that, in the child component, **create a local data variable with `ref` of a copy of the object prop** and bind, for example the inputs of a login form, to that local variable instead of the object prop.

For an object one-level-deep, use the spread operator (`{...myObject}`).

```typescript
//Using Composition API and TypeScript
const props = defineProps<{
  user: User;
}>();
const editedUser = ref({ ...user.value });
```

Also, ESLint can save the day as, if configured correctly, it will show a hint that something is incorrect.

### Forgetting to Clean Up Your Manual Event Listeners

If you do use manual event listeners and register them on the `onMounted` hook, **ALWAYS** unregister the listeners on `onUnmounted` hook.

```javascript
import { onMounted, onUnmounted } from "vue";
onMounted(() => {
  document.body.addEventListener("keydown", handlerFunction);
});

onUnmounted(() => {
  document.body.removeEventListener("keydown", handlerFunction);
});
```

If you want to avoid coding the both hook each time, in the package `@vueuse/core`, you have a composable `useEventListener` that makes sure the registration and unregistration are done in a single line:

```javascript
useEventListener(document.body, "keydown", handlerFunction);
```

### Expecting Changes to Non-Reactive Dependencies to Trigger Updates

Computed relies on reactive dependencies in order to know when it should update.

If the dependency is not reactive, let's say `localStorage` data, then the data is not reactive even if the variable was initialized from a computed.

FOr example:

```javascript
<script setup lang="ts">
import { computed, ref } from 'vue'
const reactiveData = computed(() => localStorage.getItem('data))

function updateData(e: Event) {
  const data = (e.target as HTMLInputElement).value
  localStorage.setItem('data', data || '')
  reactiveData.value = data
}
</script>

<template>
  <div>
    <input type="text" @input="updateData" :value="reactiveData" />
  </div>
  <pre>{{ reactiveData }}</pre>
</template>
```

`reactiveData` won't show the input of the user because:

- the dependency of `reactiveData` isn't reactive.
- `data` in `updatedData` isn't reactive.

Those non-reactive sources are typically browser native APIs: localStorage API, date, network events, DOM elements, clipboard, location API, etc...

The trick is to:

- store the initial value of the variable in a `ref` to make it reactive
- make sure you update the variable's value when it needs to.

```javascript
<script setup lang="ts">
import { computed, ref } from 'vue'
const reactiveData = ref(localStorage.getItem('data'))

function updateData(e: Event) {
  const data = (e.target as HTMLInputElement).value
  localStorage.setItem('data', data || '')
  reactiveData.value = data
}
</script>
```

Otherwise, the library VueUse can help make those non-reactive sources reactive with little extra code.
**But learn it without it, as demonstrated above.**

### Not Considering TypeScript

TypeScript will make the developper experience much better and smoother because silent issues will scream out loud.

See this example that contains an error:

```htm
<script setup>
  import { ref } from "vue";
  const user = ref({
    username: "danielkelly_io",
    email: "daniel@vueschool.io",
    name: "Daniel Kelly",
  });
</script>

<template>
  <ul>
    <li>
      <strong>Username</strong>
      <span>{{ user.username }}</span>
    </li>
    <li>
      <strong>Email</strong>
      <span>{{ user.mail }}</span>
    </li>
    <li>
      <strong>Name</strong>
      <span>{{ user.name }}</span>
    </li>
  </ul>
</template>
```

With vanilla JavaScript, nothing in the IDE tells you that line 18 is problematic.

Using TypeScript, ESLint would underline the `mail` property of `user` and tell you that it doesn't exist.

It may take a few month to learn, but the advantages far exceed the drawbacks.

Now, I came back to this paragraph a few months after and I want to share what I've learned from using TypeScript on the [masterclass of Vueschool.io](https://vueschool.io/courses/the-vuejs-3-master-class).

## Destructuring Reactive Data

When you destructure an object, even if it is reactive, the destructured properties loose the reactivity.

The options are either to:

- use `computed` for readonly variable used in your template.
- use the actual object's property.
- use `toRefs` from `vue` and wrap the `reactive` variable with it before destructuring:

```javascript
import { reactive, toRefs } from 'vue'

const myObject = reactive({
    prop1: "Value1",
    prop2: "Value2"
    prop3: "Value3"
});

//prop1 to prop3 are not reactive because only the object is.
const { prop1, prop2, prop3 } = myObject;

//prop1 to prop3 are reactive because they are ref()s.
const { prop1, prop2, prop3 } = toRefs(myObject);
```

This can become an issue in a composable: call `toRefs` on the returned object:

```javascript
import { reactive, toRefs } from "vue";
export const useLion = () => {
  const animal = reactive({
    name: "Lion",
    diet: "Carnivore",
    lifespan: "8-12 years",
  });

  return toRefs(animal);
};
```

## Calling Composables in the Wrong Place

Composables should not be called from within in the body of a function, even if it is declared in a `<script setup>...</script>` or any other script.

Composables should only be called from:

- in `<script setup>...</script>` or the `setup` method
- in some lifecycle hooks.
- in the top level of a composable

Also, you should call a composable synchronously.

Why theses restrictions? It comes to the contexts where Vue is able to determine the current active component instance. That is necessary to register lifecycle hooks and to link the `computed` and `watch` to that active component.

I'll share an example:

```typescript
<script setup lang="ts">
import { useA } from '@/composables/useA'
const a = useA()

const toAvoid =() {
  //✅ This is OK
  const a = useA();
}
const toPrefer =() {
  //❌ This is wrong
  a.doWhatever();
}
</script>
<template>
  <div>Only use composables at the top level of script setup</div>
</template>
```

However, you can use a composable with another composable at the top level of the composable using the other one:

```typescript
import { useB } from "./useB";
export const useA = () => {
  //✅ This is OK
  const b = useB();
  function doThing() {}
  //❌ This is wrong
  function doSomethingElse() {
    const b = useB();
  }
};
```

Read more [in the official docs](https://vuejs.org/guide/reusability/composables.html#usage-restrictions).

## Using `v-html` with User Provided Data

Use `v-html`:

- from a trusted source
- from sanitized data

Don't use `v-html` if the source:

- comes from an `input` or `textarea`
- is available to an external use.

## Unnecessary Manual DOM Manipulation

Just don't manipulate the DOM when you use VueJS.

Period.

However, you will sometimes need access to native methods on a DOM element, like a `dialog` element.

On a `dialog` element, you want to use the `showModal()` and `close()` to handle the modal lifecycle.

Using [template refs](https://vuejs.org/guide/essentials/template-refs) is the best practice to access the DOM elements.

See the usage [in this example](https://github.com/JeremieLitzler/vueschool-course/blob/project-vueuse-for-everyone/src/components/UsePageLeaveWithNativeDialog.vue).

## Any other mistakes you want to mention?

Write me a message with an example and I'll review it.

Thanks.
