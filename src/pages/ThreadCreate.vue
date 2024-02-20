<template>
  <div class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <thread-editor @@save="saveThread" @@cancel="returnToForum" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useForumStore } from '@/stores/ForumStore';
import { useThreadStore } from '@/stores/ThreadStore';
import { RouteName } from '@/enums/RouteName';
import ThreadEditor from '@/components/ThreadEditor.vue';

const { getForumById } = useForumStore();
const { createThread } = useThreadStore();
const router = useRouter();
const props = defineProps<{ forumid: string }>();

const forum = getForumById(props.forumid);

const saveThread = async (payload: CreateThreadRequest) => {
  const threadId = await createThread({
    forumId: forum.id!,
    ...payload,
  });

  router.push({
    name: RouteName.ThreadShow,
    params: { id: threadId },
  });
};

const returnToForum = () => {
  router.push({
    name: RouteName.ForumShow,
    params: { id: forum.id },
  });
};
</script>

<style scoped></style>
