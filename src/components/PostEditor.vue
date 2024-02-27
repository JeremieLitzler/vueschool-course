<template>
  <div class="col-full">
    <form @submit.prevent="savePost">
      <div class="form-group">
        <textarea
          v-model="newPostText"
          cols="30"
          rows="10"
          class="form-input"
        />
      </div>
      <div class="form-actions">
        <button class="btn-blue">{{ buttonText }}</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    threadId: {
      type: String,
      default: null,
    },
    post: {
      type: Object,
      default: () => ({ text: "" }),
    },
  },
  data() {
    return {
      newPostText: this.post?.text ?? null,
    };
  },
  computed: {
    postIsEdited() {
      return this.post?.text;
    },
    buttonText() {
      return !this.postIsEdited ? "Submit post" : "Update post";
    },
  },
  methods: {
    savePost() {
      if (this.postIsEdited) {
        this.$emit("update-post", { text: this.newPostText, id: this.post.id });
      } else {
        this.$emit("add-post", {
          text: this.newPostText,
          threadId: this.threadId,
        });
      }
      this.newPostText = null;
    },
  },
};
</script>

<style lang="scss" scoped></style>
