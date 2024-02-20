<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input
        v-model="title"
        type="text"
        id="thread_title"
        class="form-input"
        name="title"
      />
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea
        v-model="body"
        id="thread_content"
        class="form-input"
        name="content"
        rows="8"
        cols="140"
      ></textarea>
    </div>

    <div class="btn-group">
      <button @click="cancel" class="btn btn-ghost">Cancel</button>
      <button class="btn btn-blue" type="submit" name="Publish">Publish</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emits = defineEmits<{
  (event: '@save', entry: CreateThreadRequest): void;
  (event: '@cancel'): void;
}>();

const title = ref('');
const body = ref('');

const save = () => {
  emits('@save', { title: title.value, body: body.value });
};
const cancel = () => {
  emits('@cancel');
};
</script>

<style scoped></style>
