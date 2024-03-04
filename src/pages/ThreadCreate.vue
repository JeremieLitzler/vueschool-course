<template>
  <div class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <thread-editor
      @save="saveThread"
      @cancel="returnToForum"
      @dirty="formIsDirty = true"
      @clean="formIsDirty = false"
    />
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
  data() {
    return { formIsDirty: false };
  },
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
      console.log("ThreadCreate > methods > returnToForum");
      this.$router.push({
        name: RouteName.ForumShow,
        params: { id: this.forum.id },
      });
    },
  },
  beforeRouteLeave() {
    console.log("beforeRouteLeave > formIsDirty", this.formIsDirty);
    if (this.formIsDirty) {
      const confirmed = window.confirm(
        //TODO : clicking cancel button fires twice this guard... Why?
        "Are you sure you want to leave? Unsaved changes will be lost!!"
      );
      if (!confirmed) {
        return false;
      }
    }
  },
};
</script>

<style lang="scss" scoped></style>
