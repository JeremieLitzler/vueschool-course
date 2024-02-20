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
        <button class="btn-blue">Submit post</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    threadId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      newPostText: "",
    };
  },
  methods: {
    addPost() {
      const post = {
        text: this.newPostText,
        threadId: this.threadId,
      };
      this.$emit("add-post", { post });
      this.newPostText = "";
    },
  },
};
</script>

<style lang="scss" scoped></style>
