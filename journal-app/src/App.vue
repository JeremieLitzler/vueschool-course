<script setup lang="ts">
import { reactive } from "vue";
import TheHeader from "@/components/TheHeader.vue";
import EntryEditor from "./components/EntryEditor.vue";
import EntryCard from "@/components/EntryCard.vue";
import type User from "@/types/User";
import JournalEntry from "./types/JournalEntry";

const user: User = reactive({
  id: 1,
  username: "Jeremiel",
  settings: [],
});

const entries = reactive<JournalEntry[]>([]);
const handleAddEntry = (entry: JournalEntry) => {
  entries.unshift(entry);
};
</script>

<template>
  <main class="container m-auto p-10">
    <TheHeader />
    <EntryEditor @@create="handleAddEntry" />
    <ul>
      <li v-for="entry in entries" :key="entry.id">
        <EntryCard :entry="entry" />
      </li>
    </ul>
  </main>
</template>
