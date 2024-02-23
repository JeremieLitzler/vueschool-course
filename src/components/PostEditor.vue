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
import { useUserStore } from '@/stores/UserStore';

const props = defineProps<{
  threadId: string;
}>();
const emits = defineEmits<{
  (event: '@add-post', entry: AddPostPayload): void;
}>();

const { getAuthUser } = useUserStore();
const newPostText = ref('');

const addPost = () => {
  const authUser = getAuthUser();
  if (!authUser) {
    //TODO : handle not authentifcated user
  }
  const post: Post = {
    id: '',
    text: newPostText.value,
    threadId: props.threadId,
  };
  emits('@add-post', { post });
  newPostText.value = '';
};
</script>

<style scoped></style>
