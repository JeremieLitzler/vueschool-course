<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>useFetch & computedAsync </pre>
    </summary>
    <article>
      <h3>Demo of <i>useFetch</i></h3>
      <input type="text" v-model="id" />
      <pre v-if="error" style="color: red">{{ error }}</pre>
      <p v-else-if="isFetching" style="color: blue">Loading...</p>
      <pre v-else>{{ data }}</pre>
    </article>
    <article>
      <h3>Demo of <i>computedAsync</i></h3>
      <p v-if="loading" style="color: blue">Loading...</p>
      <pre v-else>{{ post }}</pre>
    </article>
  </details>
</template>

<script setup lang="ts">
import { ref, computed, inject } from "vue";

import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);

import { useFetch, computedAsync } from "@vueuse/core";
const id = ref(1);
const url = computed(
  () => `https://jsonplaceholder.typicode.com/todos/${id.value}`
);
const { isFetching, data, error } = useFetch(url, {
  refetch: true,
});

const loading = ref(true);
const urlApiPost = computed(
  () => `https://jsonplaceholder.typicode.com/posts/${id.value}`
);

const post = computedAsync(async () => {
  const res = await fetch(urlApiPost.value);
  loading.value = false;
  return res.json();
}, null);
</script>
<style scoped></style>
