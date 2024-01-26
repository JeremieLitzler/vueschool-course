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

const handleAddEntry = (entry: JournalEntry) => {
  console.log(entry);
};
</script>

<template>
  <main class="container m-auto p-10">
    <TheHeader />
    <EntryEditor @@create="handleAddEntry" />
    <ul>
      <li>
        <EntryCard />
      </li>
    </ul>
  </main>
</template>
