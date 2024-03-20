# Fundamentals

## Understanding the Lifecycle Hooks in Vue.js

Find the diagram of the lifecycle [here](https://vuejs.org/guide/essentials/lifecycle.html).

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

or for several classes:

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

- A `computed` must return a value, contrary to methods.
- When do you need to use `computed` instead of methods?
  - When you change data, use methods.
  - When you change the presentation on the UI, use computed properties.

## About `props`

When you use a prop, make sur to use _camel-case_ in the template, otherwise, it won't work.

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

Using it the following way won't work to add the `error` class, but will use the default value.

```htm
<notification-message notificationType="red"></notification-message>
```

Using it this correct way will render the HTML fine:

```htm
<notification-message notification-type="red"></notification-message>
```

## The `$event` handler

See [the docs](https://vuejs.org/guide/essentials/event-handling).

## Differences between `v-if` and `v-show`

`v-if` excludes the DOM element from the DOM at render time.

`v-show` simply toggle the `display` CSS property.

Choosing between the two depends on the usecase and the frequency you want to toggle the DOM element.

Listen to Daniel Kelly about that [in the 88th lesson of the original masterclass](https://vueschool.io/lessons/displaying-a-loading-indicator-while-components-fetch-async-data) at 4:45.
