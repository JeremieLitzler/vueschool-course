# Fundamentals

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
  template: '#notification-message-template',
  props: {
    notificationType: {
      type: String,
      default: 'info',
    },
  },
}
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