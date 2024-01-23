## Common Vue.js Mistakes and How to Avoid Them

The following are a kind of a checklist.

## Don't Omit the Key Directive on v-for

Why? What does the `:key` attribut do?

While it will be OK not to put a `:key` for static elements (e.g. elements that don't contain their own state like `p`, `li`, `span`, `label`), the ones that do contain the own state will not behave properly.

For example, `input` or `textarea` elements or even components with their own state will produce a weird result.

See [the demo of the issue with a key provided](https://youtu.be/tXngJkLsz0U).

**ESLint will show you the issue.**

However, it doesn't stop there: having a key that contains a same value for multiple entries in an array will cause the same effect.

So what should and shouldn't the key be?

- not the index in the array
- not the same value of each value

So how do you create unique key?

With a list of objects, you could concatenate 2 properties or `JSON.stringify` the object.

Read more on [this blog post](https://vueschool.io/articles/vuejs-tutorials/tips-and-gotchas-for-using-key-with-v-for-in-vue-js-3/).

## Prop Drilling

It is defined by passing a prop down several level from a component to its N+2 or more.

The same is true when component N+2 emits back...

It is anti-pattern.

How to avoid it?

### 1. use provide `provide` / `inject`

See [the docs for more details](https://vuejs.org/guide/components/provide-inject.html) or my notes on [the course "Composition API"](course-vue-3-composition-api.md#what-about-passing-variables-from-component-n-to-component-n2-without-using-a-prop-on-component-n1).

That is how VueRouter does it.

### 2. use global state management.

See [the docs for more details](https://vuejs.org/guide/scaling-up/state-management.html).

A global state doesn't only mean Vuex or Pinia, but a simple composable can work.

You will then need to use the composable on each component.

The caveat: set the data of the composable outside of the composable. See [the example](https://github.com/vueschool/common-vue-js-mistakes/commit/897dfacfbeb2306fbfe1e985652a7eaec50522f0).

## Watching Arrays the Wrong Way

Watching the array requires to be done in the deep mode.

```javascript
watch(numbers, () => console.log('new number added'), {
  //deep option
  deep: true
})
```

Why?

When you add, remove or modify an item in an array, you must use the `deep` option so that Vue is working against a brand new array to spot the difference.

Another syntax is to use an anonymous arrow function:

```javascript
watch(
  () => [...numbers.value],
  () => console.log('new number added')
);
```

**The same applies to objects!!!**

## Replacing Reactive State the Wrong Way

We cannot replace a whole `reactive` object, NEVER.

Use `ref` instead when you replace a reactive variable entirely.

Also, remember: replacing entirely a `reactive` variable's value will break the reactivity...

It seems that using `reactive` may depreceated someday... or use it wisely!

## Unintentionally Mutating Props

Mutating props means modifying a property of an Object prop passed by a component to a child component using `v-model` in the child component.

The effect is that the child modifies the Object prop's properties and the change of a property of the object is reflected on the parent component.

Doing the same with a primitive prop would log a warning because props are readonly.

To avoid that, in the child component, **create a local variable with `ref` of a copy of the Object prop** and bind, for example the inputs of a login form, to the local variable instead of the Object prop.

For an object one-level-deep, use the spread operator (`{...myObject}`).

Also, ESLint can save the day as, if configured correctly, would show a hint that something is incorrect.

### Forgetting to Clean Up Your Manual Event Listeners

If you do use manual event listeners and register them on the `onMounted` hook, **ALWAYS** unregister the even listeners on `onUnmounted` hook.

```javascript
import { onMounted, onUnmounted } from "vue";
onMounted(() => {
    document.body.addEventListener('keydown',handlerFunction)
})

onUnmounted(() => {
    document.body.removeEventListener('keydown',handlerFunction)
})
```

In the package `@vueuse/core`, you have a composable `useEventListener` that makes sure the registration and unregistration are done in a single line:

```javascript
useEventListener(document.body, "keydown", handlerFunction);
```

### Expecting Changes to Non-Reactive Dependencies to Trigger Updates

Computed relies on reactive dependencies in order to know when it should update.

If the dependency is not reactive, let's say `localStorage` data, then the data is not reactive even if the variable was initialized from a computed.

Those non-reactive sources are typically browser native APIs: localStorage API, date, network events, DOM elements, clipboard, location API, etc...

The trick is to:

- store the initial value of the variable in a `ref` to make it reactive
- make sure you update the variable's value when it needs to.

Otherwise, the library VueUse can help make those non-reactive sources reactive with little extra code.

**But learn it without it...**

### Not Considering TypeScript

TypeScript will make the developper experience much better and smoother because silent issues will scream out loud.

See this example that contains an error:

```vue
<script setup>
import { ref } from 'vue'
const user = ref({
  username: 'danielkelly_io',
  email: 'daniel@vueschool.io',
  name: 'Daniel Kelly'
})
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

With vanilla JavaScript, nothing you in the IDE that line 18 is problematic.

Using TypeScript, ESLint would underline the `mail` property of `user` and tell you that it doesn't exist.

It may take a few month to learn, but the advantages far exceed the drawbacks.

### Destructuring Reactive Data

When you destructure an object, even if it is reactive, the destructured properties are not reactive anymore.

The options are either to:

- use `computed` for readonly variable used in your template.
- use the actual object's property
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

This can be an issue in a composable: call `toRefs` on the returned object.

### Calling Composables in the Wrong Place

Composables should not be called from:

- in the body of a function, even if it is declared in a `<script setup>...</script>` or any other script.

Composables should only be called from:

- in `<script setup>...</script>` or the `setup` method
- in some lifecycle hooks.
- in the top level of a composable

Also, you should call a composable synchronously.

Why? See [the docs for more](https://vuejs.org/guide/reusability/composables.html#usage-restrictions).

### Using `v-html` with User Provided Data

Use `v-html`:

- from a trusted source
- from sanitized data

Don't use `v-html`:

- if the source comes from an `input` or `textarea` and is available to an external use.

### Unnecessary Manual DOM Manipulation

Just don't manipulate the DOM when you use VueJS.

Period.
