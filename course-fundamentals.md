# Fundamentals

## Understanding the Lifecycle Hooks in Vue.js

Find the diagram of the lifecycle [here](https://vuejs.org/guide/essentials/lifecycle.html#lifecycle-diagram).

Also, find the lifecycle hook list in [the official docs](https://vuejs.org/api/composition-api-lifecycle.html) to visualize the existing hooks.
This documentation explains the hooks in Vue 3 and the Composition API.

For the Options API, see [this other documentation](https://vuejs.org/api/options-lifecycle.html).

A few comments:

- it is important to note that in the `beforeCreate` hook, the reactivity isn't in place yet. So you can update any data then.
- on `mounted` gives access to `this.$el`, which the DOM element where the app resides.

The order is : `beforeCreate > created > beforeMount > mounted > beforeUnmount > unmounted`

## Double mustaches

We can evaluate one expression in a `{{ ... }}`.

We cannot declare variables or declare if statements.

However, the ternary statement can be used in `{{ ifTrue ? "Display this" : "Display that" }}`.

Or even us the `OR` operator `{{ aStringValue || "Default value" }}`.

## Dynamic CSS classes

Instead of creating computed to return a string value of a CSS class based on a JavaScript computation, it is a best practice to use dynamic CSS classes that you toggle on or off based computed or JavaScript expression returns `true` or `false`.

Below, if the `item.purchased`, we toggle `strikeout`.

```javascript
        <li
          v-for="item in items"
          :key="item.label"
          class="item"
          :class="{strikeout: item.purchased}"
        >
          {{ item.label }}
        </li>

```

If you need you can combine several classes:

```javascript
        <li
          v-for="item in items"
          :key="item.label"
          class="item"
          :class="[item.purchased ? 'strikeout': '', item.highlight ? 'highlight': '']"
        >
          {{ item.label }}
        </li>

```

## About `computed`

- A `computed` must return a value, contrary to methods can be void.

The common question : when do you need to use `computed` instead of methods?

- When you change data, use methods.
- When you change the presentation on the UI, use computed properties.

## About `props`

When you use a prop, make sur to use [_kebab-case_](https://medium.com/@salmankhan_27014/a-comprehensive-guide-to-understanding-naming-conventions-camel-case-vs-pascal-case-vs-kebab-case-e8d3bf1e14db) in the template.

For example, this component declares a prop `notificationType`:

```javascript
let NotificationMessageComponent = {
  template: "#notification-message-template",
  props: {
    notificationType: {
      type: String,
      default: "info",
    },
  },
};
```

Using it the _camelCase_ name will make the linter unhappy:

```htm
<notification-message notificationType="error"></notification-message>
```

```htm
<notification-message notification-type="error"></notification-message>
```

Read [the rule in the styleguide](https://v2.vuejs.org/v2/style-guide/?redirect=true#Prop-name-casing-strongly-recommended):

> **Prop names should always use camelCase during declaration, but kebab-case in templates and JSX.**
>
> We’re simply following the conventions of each language. Within JavaScript, camelCase is more natural. Within HTML, kebab-case is.

## The `$event` object

If you need, the original DOM event is available under `$event`, that you can pass to the methods that to your `v-on`
or `@` directives.

```htm
<template>
  <!-- using $event special variable -->
  <button @click="warn('Form cannot be submitted yet.', $event)">Submit</button>

  <!-- using inline arrow function -->
  <button @click="(event) => warn('Form cannot be submitted yet.', event)">
    Submit
  </button>
</template>
<script setup>
  function warn(message, event) {
    // now we have access to the native event
    if (event) {
      event.preventDefault();
    }
    alert(message);
  }
</script>
```

See [the docs](https://vuejs.org/guide/essentials/event-handling).

## Differences between `v-if` and `v-show`

`v-if` excludes the DOM element from the DOM at render time.

`v-show` simply toggle the `display` CSS property.

Choosing between the two depends on the usecase and the frequency you want to toggle the DOM element.

Listen to Daniel Kelly about that [in the 88th lesson of the original masterclass](https://vueschool.io/lessons/displaying-a-loading-indicator-while-components-fetch-async-data) at 4:45.
