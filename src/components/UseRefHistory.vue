<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>useRefHistory </pre>
    </summary>
    <article>
      <h3>The shared input</h3>
      <label>
        The input:
        <input type="text" v-model="myValue" />
      </label>
    </article>
    <section>
      <article>
        <h3>Demo <i>useRefHistory</i></h3>
        <button @click="undo" class="btn-spaced">Undo</button>
        <button @click="redo" class="btn-spaced">Redo</button>
        <pre>{{ history }}</pre>
      </article>
      <article>
        <h3>Demo <i>useDebouncedRefHistory</i></h3>
        <button @click="undoDebounced" class="btn-spaced">Undo</button>
        <button @click="redoDebounced" class="btn-spaced">Redo</button>
        <pre>{{ historyDebounced }}</pre>
      </article>
    </section>
    <article>
      <h3>Demo with todo list</h3>
      <label>
        The input:
        <input type="text" v-model="newTodo" />
      </label>
      <hr />
      <button @click="addTodo" class="btn-spaced">Add todo</button>
      <button @click="undoTodo" class="btn-spaced">Remove last todo</button>
      <button @click="redoTodo" class="btn-spaced">Readd last todo</button>
      <hr />
      <ul>
        <li v-for="todo in todos" :key="todo">{{ todo }}</li>
      </ul>
    </article>
    <pre>{{ historyTodos }}</pre>
  </details>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { useRefHistory, useDebouncedRefHistory } from "@vueuse/core";

import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);

const myValue = ref("");
const { history, undo, redo } = useRefHistory(myValue);

const {
  history: historyDebounced,
  undo: undoDebounced,
  redo: redoDebounced,
} = useDebouncedRefHistory(myValue, {
  debounce: 1000,
});

const newTodo = ref("");
const todos = ref<string[]>([]);

const {
  history: historyTodos,
  undo: undoTodo,
  redo: redoTodo,
} = useRefHistory(todos, {
  deep: true,
  capacity: 15, // set the maximum history depth
});

const addTodo = () => {
  todos.value.push(newTodo.value);
  newTodo.value = "";
};
</script>
<style scoped>
section {
  display: flex;
}
section > article {
  margin: 1em;
  padding: 1em;
  border: 1px solid var(--dark-main);
}
</style>
