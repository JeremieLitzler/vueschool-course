<template>
  <div class="col-full">
    <form @submit.prevent="addPost">
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
      return this.newPostText;
    },
    buttonText() {
      return !this.postIsEdited ? "Submit post" : "Edit post";
    },
  },
  methods: {
    addPost() {
      const post = {
        text: this.newPostText,
        threadId: this.post.threadId,
      };
      if (this.postIsEdited) {
        this.$emit("update-post", { post });
      } else {
        this.$emit("add-post", { post });
      }
      this.newPostText = null;
    },
  },
};
</script>

<style lang="scss" scoped></style>
