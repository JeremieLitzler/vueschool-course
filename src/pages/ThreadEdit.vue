<template>
  <div class="col-full push-top">
    <h1>
      Editing <i>{{ thread.title }}</i>
    </h1>

    <thread-editor
      :title="thread.title"
      :body="firstPostBody"
      @@save="updateThread"
      @@cancel="cancel"
    />
  </div>
</template>

<script setup async lang="ts">
import { ref, computed } from 'vue';
import { useThreadStore } from '@/stores/ThreadStore';
import { usePostStore } from '@/stores/PostStore';
import appendRouteHelper from '@/helpers/appendRouteHelper';
import ThreadEditor from '@/components/ThreadEditor.vue';

const { toForumPage, toThreadPage } = appendRouteHelper();

const props = defineProps<{ id: string }>();

const thread = ref(await useThreadStore().fetchThread(props.id));

const firstPostBody = computed(() => {
  const post = usePostStore().getThreadFirstPostBody(thread.value);
  return post!.text;
});

const updateThread = async (payload: ThreadBaseRequest) => {
  const thread = await useThreadStore().updateThread({
    ...payload,
    threadId: props.id,
  });
  toThreadPage(thread.id!);
};
const cancel = (threadExists: boolean) => {
  if (threadExists) {
    toThreadPage(thread.value.id!);
  } else {
    toForumPage(thread.value.forumId!);
  }
};
</script>
