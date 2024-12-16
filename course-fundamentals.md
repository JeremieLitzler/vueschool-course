# Fundamentals

{{< blockcontainer jli-notice-tip "If you're interested...">}}

The course is **free** and available [here](https://vueschool.io/courses/vuejs-fundamentals?utm_source=JLI_Blog_EN&utm_medium=recommandations).

{{< /blockcontainer >}}

## Understanding the Lifecycle Hooks in Vue.js

You can find the diagram of the lifecycle [here](https://vuejs.org/guide/essentials/lifecycle.html#lifecycle-diagram).

Also, yiu can find the lifecycle hook list in [the official docs](https://vuejs.org/api/composition-api-lifecycle.html) to visualize the existing hooks.

Note: this documentation explains the hooks in **Vue 3 and the `Composition API`**.

For the Options API, see [this documentation](https://vuejs.org/api/options-lifecycle.html) explaining the `Option API` way.

A few comments:

- it is important to note that in the `beforeCreate` hook, the reactivity isn't in place yet. So you can update any data at the moment.
- on `mounted` gives access to `this.$el`, which is the DOM element where the app resides.

In short, the lifecycle order is : `beforeCreate > created > beforeMount > mounted > beforeUnmount > unmounted`

## Double mustaches

We can evaluate an expression in a `{{ ... }}`.

We cannot declare variables or declare if statements in double mustaches. However, the ternary statement can be used in `{{ ifTrue ? "Display this" : "Display that" }}`, or the `OR` operator `{{ aStringValue || "Default value" }}`.

## Dynamic CSS classes

Instead of creating computed to return a string value of a CSS class based on a JavaScript computation, it is a best practice to use dynamic CSS classes.

You can use them to toggle on or off JavaScript expressions that return `true` or `false`.

Below, if the `item.purchased` is `true`, we toggle `strikeout` CSS class on the element. The example uses the object syntax.

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

If you need, you can combine several classes in the array syntax:

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

A `computed` is a calculated value and must return a value, contrary to methods that can be void.

The common question : when do you need to use `computed` over methods?

- When you change data, use methods.
- When you change the presentation on the UI, use computed properties.

## About `props`

When you use a prop, make sur to use [_kebab-case_](https://medium.com/@salmankhan_27014/a-comprehensive-guide-to-understanding-naming-conventions-camel-case-vs-pascal-case-vs-kebab-case-e8d3bf1e14db) in the template.

For example, this component declares a prop `notificationType`:

```javascript
let NotificationMessageComponent = {
  template: '#notification-message-template',
  props: {
    notificationType: {
      type: String,
      default: 'info',
    },
  },
};
```

Using it the _camelCase_ name in the template will make the linter unhappy:

```htm
<notification-message notificationType="error"></notification-message>
```

With the following, you're good to go:

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

Generally speaking,

- `v-if` has higher toggle costs because the DOM element is not rendered if the condition is false.
- `v-show` has higher initial render costs because the DOM element is rendered if not matter the the condition value. A `display: none` is simply apply by Vue.

So prefer `v-show` if you need to toggle something very often, and prefer `v-if` if the condition is unlikely to change at runtime.
