# Advanced Components: Exposing Internal State

## What does it mean

The idea is to expose internal state of a component while retaining the ability to validate what the user passes to it.

For example,

- a modal usually has its own trigger, there are cases when you want to toggle the same modal with another trigger.

- sometimes, the user may just want to know some internal values. This is the case of logical components like mouse position.

## Use defineExpose with Script Setup

Through `defineExpose` utility function, you decide to expose any refs, computed or methods from the component to the outside.

```htm
<script setup>
  import { ref, defineExpose } from "vue";
  const isOpen = ref(false);
  const open = () => (isOpen.value = true);
  const close = () => (isOpen.value = false);
  defineExpose({
    //this exposes the open method to any parent component
    open,
  });
</script>
```

In the parent, it looks like this:

```htm
<script setup>
  import { ref } from "vue";
  import Modal from "./components/script_setup/Modal.vue";
  const modal = ref(null);
</script>

<template>
  <!-- the modal.open() is the exposed method -->
  <button @click="modal.open()">Outside trigger</button>
  <Modal ref="modal" />
</template>
```

Using the Options API, it works as follows:

```javascript
export default {
  expose: ["open"],
  methods: {
    open() {
      this.isOpen = true;
    },
  }
}
</script>
```

There is a JSX way, but I am not very keen to mix template and javascript...

## Slot Props

See [the lesson on the mouse coordinates](https://vueschool.io/lessons/mouse-coordinates-exercise) for a complete example.

I have saved the [code-along project in my GitHub](https://github.com/JeremieLitzler/vueschool-course/tree/project-advanced-components-exposing-internal-state).

## About accessibility of complex components

See the library `zap-js` and [its documentation](https://zagjs.com/overview/introduction) detailing usage for elements like:

- Accordion
- Avatar
- Carousel
- Checkbox
- ColorPicker
- Combobox
- Dialog
- Editable
- File Upload
- Hover Card
- Menu
- Context Menu
- Nested Menu
- Number Input
- Pagination
- Pin Input
- Progress - Linear New
- Progress - Circular New
- Popover
- Radio Group
- Segmented Control
- Range Slider
- Rating Group
- Select
- Slider
- Splitter New
- Switch
- Tabs
- Tags Input
- Toast
- Toggle Group
- Tooltip
