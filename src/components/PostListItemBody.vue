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
import { usePostStore } from '@/stores/PostStore';
import { useCommonStore } from '@/stores/CommonStore';
import { useUserStore } from '@/stores/UserStore';
import type Post from '@/types/Post';
import type PostUpdateRequest from '@/types/PostUpdateRequest';
import PostEditor from '@/components/PostEditor.vue';

const props = defineProps<{ post: Post }>();
const emits = defineEmits<{
  (event: '@refresh-posts', value: boolean): void;
}>();
const asyncUiElement = 'editedPost';
const postEdited = ref<string | null>(null);
const savingPost = computed(() => {
  return !useCommonStore().isUiElementReady(asyncUiElement);
});
const linkText = computed(() =>
  postEdited.value === props.post.id ? 'Cancel' : 'Edit'
);

/**
 * Client side rule, also enforced on the server side.
 * @see firestore.rules file at the root of the project.
 */
const canEditPost = computed(
  () => useUserStore().getAuthUser()?.id === props.post.userId
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
  //  This emit cascade to PostList (parent) and ThreadShow (grand-parent).
  //  It is needed to refresh the PostList component with what the updated
  //  store contains.
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
