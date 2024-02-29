<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input
        v-model="form.title"
        type="text"
        id="thread_title"
        class="form-input"
        name="title"
      />
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea
        v-model="form.body"
        id="thread_content"
        class="form-input"
        name="content"
        rows="8"
        cols="140"
      ></textarea>
    </div>

    <div class="btn-group">
      <button @click="$emit('cancel')" class="btn btn-ghost">Cancel</button>
      <button class="btn btn-blue" type="submit" name="Publish">
        {{ threadExists ? "Update" : "Publish" }}
      </button>
    </div>
  </form>
</template>

<script>
import { useRouteName } from "@/helpers/routeNameEnum";
/* eslint-disable */
const { RouteName } = useRouteName();
/* eslint-enable */

export default {
  props: {
    title: { type: String, default: "" },
    body: { type: String, default: "" },
  },
  data() {
    return {
      RouteName,
      form: {
        title: this.title,
        body: this.body,
      },
    };
  },
  computed: {
    threadExists() {
      return !!this.title;
    },
  },
  methods: {
    save() {
      this.$emit("save", {
        ...this.form,
      });
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="scss" scoped></style>
