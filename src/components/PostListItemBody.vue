<template>
  <div class="post-content">
    <a
      @click.prevent="toggleEditMode(post.id)"
      href="#"
      style="margin-left: auto"
      class="link-unstyled"
      title="Make a change"
      ><i>{{ linkText }}</i></a
    >
    <div>
      <post-editor
        v-if="postEdited === post.id"
        :post="post"
        @update-post="savePost"
      />
      <p v-else>
        {{ post.text }}
      </p>
    </div>
  </div>
</template>

<script>
import PostEditor from "./PostEditor.vue";
export default {
  components: { PostEditor },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      postEdited: null,
    };
  },
  computed: {
    linkText() {
      return this.postEdited === this.post.id ? "Cancel" : "Edit";
    },
  },
  methods: {
    toggleEditMode(postId) {
      this.postEdited = postId === this.postEdited ? null : postId;
    },
    savePost(payload) {
      this.$store.dispatch("updatePost", { ...payload });
      this.postEdited = null;
    },
  },
};
</script>

<style lang="css" scoped>
.post-content {
  display: flex;
  flex-direction: column;
}
.post-content p {
  margin-bottom: 2em;
}
.post-content a {
  margin-bottom: 1em;
}
</style>
