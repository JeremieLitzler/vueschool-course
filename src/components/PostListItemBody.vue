<template>
  <div class="post-content">
    <a
      @click.prevent="toogleEditMode(post.id)"
      href="#"
      style="margin-left: auto"
      class="link-unstyled"
      title="Make a change"
    >
      <i>{{ linkText }}</i>
    </a>
    <div>
      <post-editor
        v-if="postEdited === post.id"
        :source-post="post"
        @@update-post="savePost"
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

const { post } = defineProps<{ post: Post }>();
const postEdited = ref<string | null>(null);
const linkText = computed(() =>
  postEdited.value === post.id ? 'Cancel' : 'Edit'
);

const toogleEditMode = (postId: string) => {
  postEdited.value = postId === postEdited.value ? null : postId;
};

const savePost = (entry: PostUpdateRequest) => {
  console.log('PostListItemBody > savePost > payload', entry);

  usePostStore().updatePost({ ...entry });
  postEdited.value = null;
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
