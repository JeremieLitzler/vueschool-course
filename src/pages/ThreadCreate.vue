<template>
  <div class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <thread-editor
      @@save="saveThread"
      @@cancel="toForumPage(forum.id!)"
      @@dirty-form="formIsDirty = true"
      @@clean-form="formIsDirty = false"
    />
  </div>
</template>

<script setup async lang="ts">
import { ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import ThreadEditor from '@/components/ThreadEditor.vue';
import { useForumStore } from '@/stores/ForumStore';
import { useThreadStore } from '@/stores/ThreadStore';
import useAppendRouteHelper from '@/helpers/appendRouteHelper';

const { createThread } = useThreadStore();
const props = defineProps<{ forumid: string }>();

const { toForumPage, toThreadPage } = useAppendRouteHelper();

const forum = await useForumStore().fetchForum(props.forumid);
const formIsDirty = ref(false);

const saveThread = async (payload: ThreadBaseRequest) => {
  const threadId = await createThread({
    forumId: forum.id!,
    ...payload,
  });

  toThreadPage(threadId);
};
onBeforeRouteLeave((_to, _from) => {
  //TODO : clicking cancel button fires twice this guard... Why?
  if (formIsDirty.value) {
    const confirmed = window.confirm(
      'Are you sure you want to leave? Unsaved changes will be lost!!'
    );
    if (!confirmed) {
      return false;
    }
  }
});
</script>

<style scoped></style>
@/composables/appendRouteHelper
