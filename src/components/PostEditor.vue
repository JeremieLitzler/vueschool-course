<template>
  <div class="col-full">
    <section class="post-editor-cta" v-if="!postingAllowed">
      <h2>Want to participate?</h2>
      <router-link
        :to="{ name: RouteName.UserLogin, query: { redirectTo: $route.path } }"
        class="btn-green btn-small"
        >Login</router-link
      >
      <p>or</p>
      <router-link
        :to="{
          name: RouteName.UserRegister,
          query: { redirectTo: $route.path },
        }"
        class="btn-green btn-small"
        >Register</router-link
      >
    </section>
    <vee-form v-else @submit="savePost" :key="formKey">
      <app-form-field
        as="textarea"
        name="message"
        label="New message"
        v-model="newPostText"
        rules="required|min:2"
        :disabled="disableForm"
        cols="30"
        rows="10"
      />
      <div class="form-actions">
        <button :disabled="disableForm" class="btn-blue">
          {{ buttonText }}
        </button>
      </div>
    </vee-form>
  </div>
</template>

<script>
import { useRouteName } from "@/helpers/routeNameEnum";
import useUUID from "@/helpers/uniqueIdHelper";
/* eslint-disable */
const { RouteName } = useRouteName();
/* eslint-enable */

export default {
  props: {
    threadId: {
      type: String,
      default: null,
    },
    post: {
      type: Object,
      default: () => ({ text: null }),
    },
    disableForm: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      RouteName,
      newPostText: this.post?.text ?? null,
      formKey: useUUID().createId(),
    };
  },
  computed: {
    postingAllowed() {
      console.log(
        "PostEditor > postingAllowed > authId",
        this.$store.state.auth.authId
      );
      return this.$store.state.auth.authId !== null;
    },
    postIsEdited() {
      const result = this.post?.text !== null;
      //console.log("postIsEdited > ", result);
      return result;
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
      this.formKey = useUUID().createId();
    },
  },
  created() {
    //console.log("loading PostEditor... with post =", this.post);
  },
};
</script>

<style lang="css" scoped>
.post-editor-cta {
  width: 18em;
  margin: 0 auto;
  text-align: center;
}
</style>
