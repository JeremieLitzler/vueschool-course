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
    <form v-else @submit.prevent="savePost">
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
import { useRouteName } from "@/helpers/routeNameEnum";
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
  },
  data() {
    return {
      RouteName,
      newPostText: this.post?.text ?? null,
    };
  },
  computed: {
    postingAllowed() {
      console.log("PostEditor > postingAllowed", this.$store.getters.authUser);
      return this.$store.getters["auth/authUser"].id;
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
