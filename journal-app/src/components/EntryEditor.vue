<script lang="ts" setup>
import { computed, ref } from "vue";
import type { Ref } from "vue";

import EmojiField from "@/components/EmojiField.vue";
import ArrowCircleRight from "@/assets/icons/arrow-circle-right.svg";
import type Emoji from "@/types/Emoji";

defineEmits(["@addEntry"]);

const MAX_CHARS = 300;
const entryMessage = ref("");
const entryMessageLength = computed(() => entryMessage.value.length);
const emoji: Ref<Emoji | null> = ref(null);
</script>
<template>
  <form
    class="entry-form"
    @submit.prevent="$emit('@addEntry', { entryMessage, emoji })"
  >
    <textarea
      v-model="entryMessage"
      :maxlength="MAX_CHARS"
      placeholder="New Journal Entry for danielkelly_io"
    ></textarea>
    <EmojiField v-model="emoji" />
    <div class="entry-form-footer">
      <span>{{ entryMessageLength }} / {{ MAX_CHARS }}</span>
      <button>Remember <ArrowCircleRight width="20" /></button>
    </div>
  </form>
</template>
