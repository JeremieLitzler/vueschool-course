<template>
  <div class="col-full push-top">
    <h1>
      Editing <i>{{ thread.title }}</i>
    </h1>

    <thread-editor
      :title="thread.title"
      :body="firstPostBody"
      @@save="updateThread"
      @@cancel="toForumPage(thread.forumId!)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ThreadEditor from '@/components/ThreadEditor.vue';
import { useThreadStore } from '@/stores/ThreadStore';
import { usePostStore } from '@/stores/PostStore';
import useAppendRouteHelper from '@/helpers/appendRouteHelper';

const { toForumPage, toThreadPage } = useAppendRouteHelper();

const { id } = defineProps<{ id: string }>();

const thread = computed(() => useThreadStore().getThreadById(id));

const firstPostBody = computed(() => {
  const post = usePostStore().getThreadFirstPostBody(thread.value);
  return post!.text;
});

const updateThread = async (payload: ThreadBaseRequest) => {
  const thread = await useThreadStore().updateThread({
    ...payload,
    threadId: id,
  });
  toThreadPage(thread.id!);
};
</script>
@/composables/appendRouteHelper
