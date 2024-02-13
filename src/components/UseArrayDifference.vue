<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>useArrayDifference</pre>
    </summary>
    <article>
      <h2>List 1</h2>
      <div class="flex gap-3">
        <label v-for="i in 10">
          <input type="checkbox" v-model="list1" :value="i" />
          {{ i }}
        </label>
      </div>
    </article>
    <article>
      <h2>List 2</h2>
      <div class="flex gap-3">
        <label v-for="i in 10">
          <input type="checkbox" v-model="list2" :value="i" />
          {{ i }}
        </label>
      </div>
    </article>
    <article>
      <h2>Difference</h2>
      <h3>Between the list 1 compared to list 2</h3>
      <p v-if="differenceL1vsL2.length === 0">None</p>
      <pre v-else>{{ differenceL1vsL2.join(",") }}</pre>
      <h3>Between the list 2 compared to list 1</h3>
      <p v-if="differenceL2vsL1.length === 0">None</p>
      <pre v-else>{{ differenceL2vsL1.join(",") }}</pre>
    </article>
  </details>
</template>

<script setup lang="ts">
import { ref, watch, inject } from "vue";

import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);

import { useArrayDifference } from "@vueuse/core";
const list1 = ref([]);
const list2 = ref([]);
const differenceL1vsL2 = useArrayDifference(list1, list2);
const differenceL2vsL1 = useArrayDifference(list2, list1);
const mergedWithDuplicates = ref<string[]>(
  differenceL1vsL2.value.concat(differenceL2vsL1.value)
);
const differencesNoDuplicates = ref(
  mergedWithDuplicates.value.filter(
    (value, pos) => mergedWithDuplicates.value.indexOf(value) === pos
  )
);
watch(
  () => [...differenceL1vsL2.value],
  () => console.log("differenceL1vsL2", differenceL1vsL2.value),
  { deep: true }
);
watch(
  () => [...differenceL2vsL1.value],
  () => console.log("differenceL2vsL1", differenceL2vsL1.value),
  { deep: true }
);
watch(
  () => [...differencesNoDuplicates.value],
  () => console.log("differencesNoDuplicates", differencesNoDuplicates.value),
  { deep: true }
);
watch(
  () => [...mergedWithDuplicates.value],
  () => console.log("differencesNoDuplicates", mergedWithDuplicates.value),
  { deep: true }
);
</script>
<style scoped></style>
