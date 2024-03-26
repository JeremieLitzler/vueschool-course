# Reusable Vue.js Components with Slots

## What is a slot

In some cases, we may want to pass a template fragment to a child component. That fragment can be passed into a slot.

Read more [in the official documentation](https://vuejs.org/guide/components/slots.html).

For example, I build a pagination component and the navigation links use slots (the code below is simplified to focus on the slot concept):

So in the component using the slots, you can have something like this:

```htm
<app-pagination>
  <template #prevRange>⏮️</template>
  <template #prevPage>◀️</template>
  <template #nextPage>▶️</template>
  <template #nextRange>⏭️</template>
</app-pagination>
```

And the pagination component looks like that:

```htm
<template>
    <!-- Left controls = previous page and previous range -->
    <ul class="app-pagination-ctrls app-pagination-ctrls-left">
      <li
        @click="previousRange"
        class="app-pagination-link app-pagination-ctrl"
      >
        <span><slot name="prevRange"></slot></span>
      </li>
      <li
        class="app-pagination-link app-pagination-ctrl"
      >
        <router-link :to="{ name: parentRouteName, query: { page: prevPage } }">
          <slot name="prevPage"></slot>
        </router-link>
      </li>
    </ul>
    <!-- The list of pages with a router-link for each page -->
    ...
    <!-- Right controls = next page and next range -->
    <ul class="app-pagination-ctrls app-pagination-ctrls-right">
      <li
        class="app-pagination-link app-pagination-ctrl"
      >
        <router-link :to="{ name: parentRouteName, query: { page: nextPage } }">
          <slot name="nextPage"></slot>
        </router-link>
      </li>

      <li
        @click="nextRange"
        class="app-pagination-link app-pagination-ctrl"
      >
        <span>
          <slot name="nextRange"></slot>
        </span>
      </li>
    </ul>
  </section>
</template>
```

## Order

When using slots, the display order is the one found in the component.

The view or other component where we use that component with slots can declare the `<template #slot-name>...</template>` in the order you want, it will not matter.

However, logic tells me that you should keep the order the same as common sense.

## Slot props

If you have this slot definition (where item is a JSON object):

```htm
<slot name="demo-slot-props" :item1="item" :item2="some string"> </slot>
```

And this usage:

```htm
<template #additional-user-info="slotProps">
  <pre>
        {{ slotProps }}
      </pre
  >
</template>
```

it would display an object with 2 properties:

- `item1` as a JSON object
- `item2` as a string.

For example:

```htm
<template #additional-user-info="slotProps">
  <pre>{{ slotProps.item1 }}</pre>
  <p>{{ slotProps.item2 }}</p>
</template>
```

The name of `slotProps` can be anything.

Using destructuring, you could have a cleaner version of the example above:

For example:

```htm
<template #additional-user-info="{item1, item2}">
  <pre>{{ item1 }}</pre>
  <p>{{ item2 }}</p>
</template>
```

## Dynamic slots

In some use cases, you find yourself needing to dynamically pass the name of slot.

For example, we have a component that can display your name in 4 different formats:

```htm
<!-- MyComponent -->
<template>
  <div v-for="item in list" :key="item.email">
    <slot name="first" :text="item.name.first"></slot>
    <slot name="last" :text="item.name.last"></slot>
    <slot name="full" :text="`${item.name.first} ${item.name.last}`"></slot>
    <slot
      name="fullWithTitle"
      :text="`${item.name.title} ${item.name.first} ${item.name.last}`"
    ></slot>
  </div>
</template>
```

The usage in a dynamic way is the following:

```htm
<!-- MyOtherComponent -->
<template>
  <MyComponent :list="list">
    <template #[selectedFormat]="{text}"> </template>
  </MyComponent>
</template>
```

The `#[selectedFormat]` is the syntax to specify dynamically the slot name.
