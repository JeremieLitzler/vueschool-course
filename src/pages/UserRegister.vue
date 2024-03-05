<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form @submit.prevent="register" class="card card-form">
        <h1 class="text-center">Register</h1>

        <div class="form-group">
          <label for="name">Full Name</label>
          <input v-model="form.name" id="name" type="text" class="form-input" />
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input
            v-model="form.username"
            id="username"
            type="text"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model="form.email"
            id="email"
            type="email"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="form.password"
            id="password"
            type="password"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="avatar">Avatar</label>
          <input
            v-model="form.avatar"
            id="avatar"
            type="text"
            class="form-input"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>
        <div class="form-actions text-right">
          <router-link :to="{ name: RouteName.UserLogin }">
            Already have an account?
          </router-link>
        </div>
      </form>
      <div class="text-center push-top">
        <button @click="registerGoogle" class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Register with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouteName } from "@/helpers/routeNameEnum";
/* eslint-disable */
const { RouteName } = useRouteName();
/* eslint-enable */

export default {
  data() {
    return {
      RouteName,
      form: {
        name: "",
        username: "",
        email: "",
        password: "",
        avatar: "",
      },
    };
  },
  methods: {
    async register() {
      console.log("Form>", this.form);
      const user = await this.$store.dispatch(
        "auth/registerUserWithEmailAndPassword",
        {
          ...this.form,
        }
      );
      console.log("Created user >", user);
      this.successRedirect();
    },
    async registerGoogle() {
      this.$store.dispatch("auth/loginWithGoogle");
      this.successRedirect();
    },
    successRedirect() {
      const redirectTo = this.$route.query.redirectTo || {
        name: RouteName.TheHome,
      };
      this.$router.push(redirectTo);
    },
  },
  created() {
    this.$store.dispatch("notifyAppIsReady");
  },
};
</script>

<style lang="scss" scoped></style>
