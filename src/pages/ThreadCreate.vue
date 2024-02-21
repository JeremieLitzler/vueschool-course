<template>
  <div class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <thread-editor @@save="saveThread" @@cancel="toForumPage(forum.id!)" />
  </div>
</template>

<script setup lang="ts">
import ThreadEditor from '@/components/ThreadEditor.vue';
import { useForumStore } from '@/stores/ForumStore';
import { useThreadStore } from '@/stores/ThreadStore';
import useAppendRouteHelper from '@/composables/useAppendRouteHelper';

const { getForumById } = useForumStore();
const { createThread } = useThreadStore();
const props = defineProps<{ forumid: string }>();

const { toForumPage, toThreadPage } = useAppendRouteHelper();

const forum = getForumById(props.forumid);

const saveThread = async (payload: ThreadBaseRequest) => {
  const threadId = await createThread({
    forumId: forum.id!,
    ...payload,
  });

  toThreadPage(threadId);
};
</script>

<style scoped></style>
