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
        id: undefined,
        text: this.newPostText,
        publishedAt: Math.floor(Date.now() / 1000),
        threadId: this.threadId,
        userId: "38St7Q8Zi2N1SPa5ahzssq9kbyp1",
      };
      this.$emit("add-post", { post });
      this.newPostText = "";
    },
  },
};
</script>

<style lang="scss" scoped></style>
