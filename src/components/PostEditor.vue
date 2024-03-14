<template>
  <section v-if="!postingAllowed" class="post-editor-cta">
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
    <vee-form @submit="savePost" :key="formKey">
      <app-form-field
        as="textarea"
        name="message"
        label="New message"
        v-model="newPostText"
        rules="required"
        cols="30"
        rows="10"
      />
      <div class="form-actions">
        <button class="btn-blue">{{ buttonText }}</button>
      </div>
    </vee-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import type PostEditorProps from '@/types/PostEditorProps';
import type PostAddRequest from '@/types/PostAddRequest';
import type PostUpdateRequest from '@/types/PostUpdateRequest';
import { RouteName } from '@/enums/RouteName';
import uniqueIdHelper from '@/helpers/uniqueIdHelper';
import firebaseService from '@/services/firebaseService';

const { sourcePost, threadId } = withDefaults(defineProps<PostEditorProps>(), {
  sourcePost: null,
});

const emits = defineEmits<{
  (event: '@add-post', entry: PostAddRequest): void;
  (event: '@update-post', entry: PostUpdateRequest): void;
}>();

//console.log('props > sourcePost', sourcePost);

const formKey = ref(uniqueIdHelper().newUniqueId);
const newPostText = ref(sourcePost?.text ?? null);
const postIsEdited = computed(() => {
  const result = sourcePost !== null;
  //console.log('postIsEdited computed', result);

  return result;
});
const postingAllowed = computed(() => {
  //console.log('PostEditor > postingAllowed', useUserStore().getAuthUser());
  return useUserStore().getAuthUser().id !== '';
});
const buttonText = computed(() =>
  !postIsEdited.value ? 'Submit post' : 'Update post'
);
const savePost = () => {
  const authUser = useUserStore().getAuthUser();
  if (!authUser) {
    //TODO : handle not authenticated user
    //       firebase returns a permission error
    console.log('PostEditor>savePost>!auth', firebaseService().getAuthUserId());
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
  formKey.value = uniqueIdHelper().newUniqueId;
};
</script>

<style scoped>
.post-editor-cta {
  width: 18em;
  margin: 0 auto;
  text-align: center;
}
</style>
