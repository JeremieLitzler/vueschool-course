<template>
  <vee-form @submit="save">
    <app-form-field
      name="title"
      label="Title:"
      v-model="form.title"
      rules="required"
      type="text"
    />
    <app-form-field
      as="textarea"
      name="content"
      label="Content:"
      v-model="form.body"
      rules="required"
      rows="8"
      cols="140"
    />
    <div class="btn-group">
      <button @click.prevent="$emit('cancel')" class="btn btn-ghost">
        Cancel
      </button>
      <button class="btn btn-blue" type="submit" name="Publish">
        {{ threadExists ? "Update" : "Publish" }}
      </button>
    </div>
  </vee-form>
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
      this.$emit("clean");
      this.$emit("save", {
        ...this.form,
      });
    },
    cancel() {
      //console.log("ThreadEditor > methods > cancel");
      this.$emit("cancel");
    },
  },
  watch: {
    form: {
      handler() {
        if (this.form.title !== this.title || this.form.body !== this.body) {
          this.$emit("dirty");
        } else {
          this.$emit("clean");
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
