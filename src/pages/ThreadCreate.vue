<template>
  <div class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <thread-editor @save="saveThread" @cancel="returnToForum" />
  </div>
</template>

<script>
import ThreadEditor from "@/components/ThreadEditor.vue";
import { useRouteName } from "@/helpers/routeNameEnum";
/* eslint-disable */
const { RouteName } = useRouteName();
/* eslint-enable */

export default {
  components: {
    ThreadEditor,
  },
  props: { forumId: { type: String, required: true } },
  computed: {
    forum() {
      return this.$store.getters.getForumById(this.forumId);
    },
  },
  methods: {
    async saveThread(threadRequest) {
      const threadId = await this.$store.dispatch("createThread", {
        ...threadRequest,
        forumId: this.forum.id,
      });

      this.$router.push({
        name: RouteName.ThreadShow,
        params: { id: threadId },
      });
    },
    returnToForum() {
      this.$router.push({
        name: RouteName.ForumShow,
        params: { id: this.forum.id },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
@/helpers/routeNameEnum @/helpers/routeNameEnum
