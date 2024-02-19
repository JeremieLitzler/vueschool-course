<template>
  <div class="col-full">
    <form @submit.prevent="addPost">
      <div class="form-group">
        <textarea
          v-model="newPostText"
          cols="30"
          rows="10"
          class="form-input"
        />
      </div>
      <div class="form-actions">
        <button class="btn-blue">Submit post</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AddPostPayload from '@/types/AddPostPayload';
import Post from '@/types/Post';

const props = defineProps<{
  threadId: string;
}>();
const emits = defineEmits<{
  (event: '@add-post', entry: AddPostPayload): void;
}>();

const newPostText = ref('');

const addPost = () => {
  const post: Post = {
    text: newPostText.value,
    publishedAt: Math.floor(Date.now() / 1000),
    threadId: props.threadId,
    userId: '38St7Q8Zi2N1SPa5ahzssq9kbyp1',
  };
  emits('@add-post', { post });
};
</script>

<style scoped></style>
