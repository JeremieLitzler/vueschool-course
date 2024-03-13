<template>
  <vee-form @submit="save">
    <app-form-field
      name="title"
      label="Title:"
      v-model="form.title"
      rules="required"
      type="text"
    />
    <app-form-field
      as="textarea"
      name="post"
      label="First post:"
      v-model="form.body"
      rules="required"
      rows="8"
      cols="140"
    />
    <div class="btn-group">
      <button @click="cancel" class="btn btn-ghost">Cancel</button>
      <button class="btn btn-blue" type="submit" name="Publish">
        {{ threadExists ? 'Update' : 'Publish' }}
      </button>
    </div>
  </vee-form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import ThreadEditorPageProps from '@/types/ThreadEditorPageProps';

const props = withDefaults(defineProps<ThreadEditorPageProps>(), {
  title: '',
  body: '',
});

const emits = defineEmits<{
  (event: '@save', entry: ThreadBaseRequest): void;
  (event: '@cancel', threadExists: boolean): void;
  (event: '@dirtyForm'): void;
  (event: '@cleanForm'): void;
}>();

const form = ref({ title: props.title, body: props.body });
const threadExists = computed(() => !!form.value.title);

const save = () => {
  emits('@cleanForm');
  emits('@save', { title: form.value.title, body: form.value.body });
};
const cancel = () => {
  emits('@cancel', threadExists.value);
};

watch(
  form.value,
  () => {
    if (form.value.title !== props.title || form.value.body !== props.body) {
      emits('@dirtyForm');
    } else {
      emits('@cleanForm');
    }
  },
  { deep: true }
);
</script>

<style scoped></style>
