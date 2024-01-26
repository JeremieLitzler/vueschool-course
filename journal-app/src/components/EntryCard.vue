<script lang="ts" setup>
import { inject } from "vue";
import { userInjectionKey } from "@/injectKeys";
import DateDisplay from "./DateDisplay.vue";
import UseEmojis from "@/composables/UseEmojis";
import type JournalEntry from "@/types/JournalEntry";

const { findEmoji } = UseEmojis();
defineProps<{
  entry: JournalEntry;
}>();

const injectUser = inject(userInjectionKey);
</script>
<template>
  <div class="entry-card">
    <div class="entry-card-body">
      <component width="75" :is="findEmoji(entry.emoji)"></component>
      <div class="entry-text">{{ entry.body }}</div>
    </div>
    <div class="entry-footer">
      <DateDisplay :date="entry.createdAt" class="mr-2" />
      |
      <span class="ml-2">{{ injectUser?.username }}</span>
    </div>
  </div>
</template>
