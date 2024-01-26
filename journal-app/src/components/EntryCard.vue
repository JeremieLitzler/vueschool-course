<script lang="ts" setup>
import DateDisplay from "./DateDisplay.vue";
import UseEmojis from "@/composables/UseEmojis";
const { findEmoji } = UseEmojis();
// const props = defineProps({
//   entry: {
//     type: () => import("@/types/JournalEntry").default,
//     required: true,
//   },
// });
</script>
<template>
  <div class="entry-card">
    <div class="entry-card-body">
      <component width="75" :is="findEmoji('happy')"></component>
      <div class="entry-text">To fill</div>
    </div>
    <div class="entry-footer">
      <DateDisplay :date="new Date()" class="mr-2" />
      |
      <span class="ml-2">danielkelly_io</span>
    </div>
  </div>
</template>
