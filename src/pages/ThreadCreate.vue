<template>
  <div class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <form @submit.prevent="saveThread">
      <div class="form-group">
        <label for="thread_title">Title:</label>
        <input
          v-model="title"
          type="text"
          id="thread_title"
          class="form-input"
          name="title"
        />
      </div>

      <div class="form-group">
        <label for="thread_content">Content:</label>
        <textarea
          v-model="body"
          id="thread_content"
          class="form-input"
          name="content"
          rows="8"
          cols="140"
        ></textarea>
      </div>

      <div class="btn-group">
        <button @click="returnToForum" class="btn btn-ghost">Cancel</button>
        <button class="btn btn-blue" type="submit" name="Publish">
          Publish
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForumStore } from '@/stores/ForumStore';
import { useThreadStore } from '@/stores/ThreadStore';
import { RouteName } from '@/enums/RouteName';

const { getForumById } = useForumStore();
const { createThread } = useThreadStore();
const router = useRouter();

const props = defineProps<{ forumid: string }>();
const forum = getForumById(props.forumid);
const title = ref('');
const body = ref('');

const saveThread = async () => {
  const threadId = await createThread({
    forumId: forum.id!,
    title: title.value,
    body: body.value,
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
