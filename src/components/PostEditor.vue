<template>
  <div class="col-full">
    <form @submit.prevent="savePost">
      <div class="form-group">
        <textarea
          v-model="newPostText"
          cols="30"
          rows="10"
          class="form-input"
        />
      </div>
      <div class="form-actions">
        <button class="btn-blue">{{ buttonText }}</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import type PostEditorProps from '@/types/PostEditorProps';
import type PostAddRequest from '@/types/PostAddRequest';
import type PostUpdateRequest from '@/types/PostUpdateRequest';

const { sourcePost, threadId } = withDefaults(defineProps<PostEditorProps>(), {
  sourcePost: undefined,
});

const emits = defineEmits<{
  (event: '@add-post', entry: PostAddRequest): void;
  (event: '@update-post', entry: PostUpdateRequest): void;
}>();

console.log('props > sourcePost', sourcePost);

const newPostText = ref(sourcePost?.text ?? null);
const postIsEdited = computed(() => {
  const result = sourcePost !== undefined;
  console.log('postIsEdited computed', result);

  return result;
});

const buttonText = computed(() =>
  !postIsEdited.value ? 'Submit post' : 'Update post'
);
const savePost = () => {
  const authUser = useUserStore().getAuthUser();
  if (!authUser) {
    //TODO : handle not authentifcated user
  }

  if (postIsEdited.value) {
    const request: PostUpdateRequest = {
      body: newPostText.value!,
      id: sourcePost?.id!,
    };
    emits('@update-post', request);
  } else {
    const request: PostAddRequest = {
      text: newPostText.value!,
      threadId: threadId!,
    };
    emits('@add-post', request);
  }
};
</script>

<style scoped></style>
