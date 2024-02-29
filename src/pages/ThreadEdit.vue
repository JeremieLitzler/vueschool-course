<template>
  <div class="col-full push-top">
    <h1>
      Editing <i>{{ thread.title }}</i>
    </h1>

    <thread-editor
      :title="thread.title"
      :body="firstPostBody"
      @save="saveThread"
      @cancel="returnToForum"
    />
  </div>
</template>

<script>
import { useRouteName } from "@/helpers/routeNameEnum";
/* eslint-disable */
const { RouteName } = useRouteName();
/* eslint-enable */

import ThreadEditor from "@/components/ThreadEditor.vue";
export default {
  components: { ThreadEditor },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    thread() {
      const match = this.$store.getters.threadById(this.id);
      //console.log("thread> ", match);
      return match;
    },
    firstPostBody() {
      const post = this.$store.getters.getThreadFirstPostBody(this.thread);
      return post.text;
    },
  },
  methods: {
    async saveThread(threadRequest) {
      const thread = await this.$store.dispatch("updateThread", {
        ...threadRequest,
        id: this.id,
      });

      this.$router.push({
        name: RouteName.ThreadShow,
        params: { id: thread.id },
      });
    },
    returnToForum() {
      this.$router.push({
        name: RouteName.ThreadShow,
        params: { id: this.thread.id },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
@/helpers/routeNameEnum @/helpers/routeNameEnum
