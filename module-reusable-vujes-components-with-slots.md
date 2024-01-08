# Reusable Vue.js Components with Slots

## Order

When using slots, the display order is the one found in the component.

The view or other component where we use that component with slots can declare the `<template #slot-name>...</template>` in the order you want, it will not matter.

However, logic tells me that you should keep the order the same as commun sense.

## Slot props

If you have this slot definition (where item is a JSON object):

```htm
<slot name="demo-slot-props" :item1="item" :item2="some string">

</slot>
```

And this usage:

```htm
    <template #additional-user-info="slotProps">
      <pre>
        {{ slotProps }}
      </pre>
    </template>
```

it would display an object with 2 properties:

- `item1` as a JSON object
- `item2` as a string.

For example:

```htm
    <template #additional-user-info="slotProps">
      <pre>
        {{ slotProps.item1 }}
      </pre>
      <p>{{ slotProps.item2 }}</p>
    </template>
```

The name of `slotProps` can be anything.

Using destructuring, you could have a cleaner version of the example above:

For example:

```htm
    <template #additional-user-info="{item1, item2}">
      <pre>
        {{ item1 }}
      </pre>
      <p>{{ item2 }}</p>
    </template>
```

## Nested slots
