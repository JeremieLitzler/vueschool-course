<template>
  <div class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <form @submit.prevent="saveThread">
      <div class="form-group">
        <label for="thread_title">Title:</label>
        <input
          v-model="title"
          type="text"
          id="thread_title"
          class="form-input"
          name="title"
        />
      </div>

      <div class="form-group">
        <label for="thread_content">Content:</label>
        <textarea
          v-model="body"
          id="thread_content"
          class="form-input"
          name="content"
          rows="8"
          cols="140"
        ></textarea>
      </div>

      <div class="btn-group">
        <button class="btn btn-ghost">Cancel</button>
        <button class="btn btn-blue" type="submit" name="Publish">
          Publish
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { useRouteName } from "@/composables/useRouteName";
/* eslint-disable */
const { RouteName } = useRouteName();
/* eslint-enable */

export default {
  props: { forum: { type: Object, required: true } },
  data() {
    return {
      RouteName,
      title: "",
      body: "",
    };
  },
  methods: {
    saveThread() {},
  },
};
</script>

<style lang="scss" scoped></style>
