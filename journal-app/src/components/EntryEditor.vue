<script lang="ts" setup>
import { ref } from "vue";
import type { Ref } from "vue";

import EmojiField from "@/components/EmojiField.vue";
import ArrowCircleRight from "@/assets/icons/arrow-circle-right.svg";
import type Emoji from "@/types/Emoji";

const entryMessage = ref("");
const emoji: Ref<Emoji | null> = ref(null);
</script>
<template>
  <form class="entry-form" @submit.prevent>
    <textarea
      v-model="entryMessage"
      placeholder="New Journal Entry for danielkelly_io"
    ></textarea>
    <EmojiField v-model="emoji" />
    <div class="entry-form-footer">
      <span>0 / 280</span>
      <button>Remember <ArrowCircleRight width="20" /></button>
    </div>
  </form>
</template>
