<script lang="ts" setup>
import { computed, ref } from "vue";
import type { Ref } from "vue";

import EmojiField from "@/components/EmojiField.vue";
import ArrowCircleRight from "@/assets/icons/arrow-circle-right.svg";
import type Emoji from "@/types/Emoji";
import JournalEntry from "@/types/JournalEntry";

const emits = defineEmits<{
  (event: "@create", entry: JournalEntry): void;
}>();

const handleSubmit = () => {
  emits("@create", {
    body: body.value,
    emoji: emoji.value,
    createdAt: new Date(),
    userId: 1,
    id: Math.random(),
  });
  body.value = "";
  emoji.value = null;
};
const MAX_CHARS = 300;
const body = ref("");
const bodyLength = computed(() => body.value.length);
const emoji: Ref<Emoji | null> = ref(null);
</script>
<template>
  <form class="entry-form" @submit.prevent="handleSubmit">
    <textarea
      v-model="body"
      :maxlength="MAX_CHARS"
      placeholder="New Journal Entry for danielkelly_io"
    ></textarea>
    <EmojiField v-model="emoji" />
    <div class="entry-form-footer">
      <span>{{ bodyLength }} / {{ MAX_CHARS }}</span>
      <button>Remember <ArrowCircleRight width="20" /></button>
    </div>
  </form>
</template>
