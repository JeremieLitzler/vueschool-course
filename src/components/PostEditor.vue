<template>
  <section v-if="!postingAllowed" class="post-editor-cta">
    <h2>Want to participate?</h2>
    <router-link
      :to="{
        name: RouteName.UserLogin,
        query: { redirectTo: $route.fullPath },
      }"
      class="btn-green btn-small"
      >Login</router-link
    >
    <p>or</p>
    <router-link
      :to="{
        name: RouteName.UserRegister,
        query: { redirectTo: $route.fullPath },
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
import uniqueIdHelper from '@/helpers/uniqueIdHelper';
import { RouteName } from '@/enums/RouteName';
import type PropsPostEditor from '@/types/PropsPostEditor';
import type PostAddRequest from '@/types/PostAddRequest';
import type PostUpdateRequest from '@/types/PostUpdateRequest';

const props = withDefaults(defineProps<PropsPostEditor>(), {
  sourcePost: null,
});

const emits = defineEmits<{
  (event: '@add-post', request: PostAddRequest): void;
  (event: '@update-post', request: PostUpdateRequest): void;
}>();

const formKey = ref(uniqueIdHelper().newUniqueId);
const newPostText = ref(props.sourcePost?.text ?? null);
const postIsEdited = computed(() => {
  const result = props.sourcePost !== null;
  return result;
});
const postingAllowed = computed(() => {
  return useUserStore().getAuthUser().id !== '';
});
const buttonText = computed(() =>
  !postIsEdited.value ? 'Submit post' : 'Update post'
);
const savePost = () => {
  const authUser = useUserStore().getAuthUser();

  if (postIsEdited.value) {
    const request: PostUpdateRequest = {
      text: newPostText.value!,
      id: props.sourcePost?.id!,
      userId: authUser.id,
    };
    emits('@update-post', request);
    console.log('@update-post emitted...');
  } else {
    const request: PostAddRequest = {
      text: newPostText.value!,
      threadId: props.threadId!,
    };
    emits('@add-post', request);
    newPostText.value = '';
  }
  //Refreshing the key of the form component allow to prevent the validation message to show.
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
