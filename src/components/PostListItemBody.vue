<template>
  <div class="post-content">
    <a
      v-if="canEditPost"
      @click.prevent="toogleEditMode(post)"
      href="#"
      style="margin-left: auto"
      class="link-unstyled"
      title="Make a change"
    >
      <i>{{ linkText }}</i>
    </a>
    <div>
      <app-spinner v-if="savingPost" />
      <post-editor
        v-if="postEdited === post.id"
        :source-post="post"
        @@update-post="updatePost"
      />
      <p v-else>
        {{ post.text }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import PostEditor from './PostEditor.vue';
import type Post from '@/types/Post';
import type PostUpdateRequest from '@/types/PostUpdateRequest';
import { usePostStore } from '@/stores/PostStore';
import { useCommonStore } from '@/stores/CommonStore';
import { useUserStore } from '@/stores/UserStore';

const { post } = defineProps<{ post: Post }>();
const emits = defineEmits<{
  (event: '@refresh-posts', value: boolean): void;
}>();
const asyncUiElement = 'editedPost';
const postEdited = ref<string | null>(null);
const savingPost = computed(() => {
  return !useCommonStore().isUiElementReady(asyncUiElement);
});
const linkText = computed(() =>
  postEdited.value === post.id ? 'Cancel' : 'Edit'
);

const canEditPost = computed(
  () => useUserStore().getAuthUser()?.id === post.userId
);
const toogleEditMode = (post: Post) => {
  postEdited.value = post.id === postEdited.value ? null : post.id;
};

const updatePost = async (request: PostUpdateRequest) => {
  console.log('@update-post caught...');

  useCommonStore().notifyAsyncUiElementState({ uiElement: asyncUiElement });
  await usePostStore().updatePost({ ...request });
  useCommonStore().notifyAsyncUiElementState({
    uiElement: asyncUiElement,
    ready: true,
  });
  postEdited.value = null;
  emits('@refresh-posts', true);
};
</script>

<style scoped>
.post-content {
  display: flex;
  flex-direction: column;
}
.post-content p {
  margin-bottom: 2em;
}
.post-content a {
  margin-bottom: 1em;
}
</style>
