<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input
        v-model="form.title"
        type="text"
        id="thread_title"
        class="form-input"
        name="title"
      />
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea
        v-model="form.body"
        id="thread_content"
        class="form-input"
        name="content"
        rows="8"
        cols="140"
      ></textarea>
    </div>

    <div class="btn-group">
      <button @click="cancel" class="btn btn-ghost">Cancel</button>
      <button class="btn btn-blue" type="submit" name="Publish">
        {{ threadExists ? 'Update' : 'Publish' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ThreadEditorPageProps from '@/types/ThreadEditorPageProps';

const props = withDefaults(defineProps<ThreadEditorPageProps>(), {
  title: '',
  body: '',
});

const emits = defineEmits<{
  (event: '@save', entry: ThreadBaseRequest): void;
  (event: '@cancel'): void;
}>();

const form = ref({ title: props.title, body: props.body });
const threadExists = computed(() => !!form.value.title);

const save = () => {
  emits('@save', { title: form.value.title, body: form.value.body });
};
const cancel = () => {
  emits('@cancel');
};
</script>

<style scoped></style>
