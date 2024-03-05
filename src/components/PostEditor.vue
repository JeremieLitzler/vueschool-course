<template>
  <section class="post-editor-cta" v-if="!postingAllowed">
    <h2>Want to participate?</h2>
    <router-link
      :to="{ name: RouteName.UserLogin, query: { redirectTo: $route.path } }"
      class="btn-green btn-small"
      >Login</router-link
    >
    <p>or</p>
    <router-link
      :to="{
        name: RouteName.UserRegister,
        query: { redirectTo: $route.path },
      }"
      class="btn-green btn-small"
      >Register</router-link
    >
  </section>
  <div v-else class="col-full">
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
import { RouteName } from '@/enums/RouteName';

const { sourcePost, threadId } = withDefaults(defineProps<PostEditorProps>(), {
  sourcePost: null,
});

const emits = defineEmits<{
  (event: '@add-post', entry: PostAddRequest): void;
  (event: '@update-post', entry: PostUpdateRequest): void;
}>();

console.log('props > sourcePost', sourcePost);

const newPostText = ref(sourcePost?.text ?? null);
const postIsEdited = computed(() => {
  const result = sourcePost !== null;
  console.log('postIsEdited computed', result);

  return result;
});
const postingAllowed = computed(() => {
  console.log('PostEditor > postingAllowed', useUserStore().getAuthUser());
  return useUserStore().getAuthUser().id !== '';
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
    newPostText.value = '';
  }
};
</script>

<style scoped>
.post-editor-cta {
  width: 18em;
  margin: 0 auto;
  text-align: center;
}
</style>
