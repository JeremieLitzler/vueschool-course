<script lang="ts">
// @ts-ignore this works fine
import { formatRelative } from "date-fns";
import { defineComponent } from "vue";
// defineComponent must be imported, it is not a macro!
// it is used to infer types for the component's options
export default defineComponent({
  props: {
    date: { type: Date, required: true },
  },
  computed: {
    formatted() {
      // @ts-ignore this works fine
      return formatRelative(this.date, Date.now());
    },
  },
  mounted() {
    this.$axios("https://jsonplaceholder.typicode.com/todos/1");
  },
});
</script>
<template>
  <div>{{ formatted }}</div>
</template>
