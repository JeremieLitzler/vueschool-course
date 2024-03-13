<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <vee-form @submit="login" class="card card-form">
        <h1 class="text-center">Login</h1>

        <div class="form-group">
          <label for="email">Email</label>
          <vee-field
            name="email"
            label="Email"
            v-model="form.email"
            rules="required|email"
            id="email"
            type="text"
            class="form-input"
          />
          <vee-error-message class="error-message" name="email" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <vee-field
            name="password"
            label="Password"
            v-model="form.password"
            rules="required|min:8"
            id="password"
            type="password"
            class="form-input"
          />
          <vee-error-message class="error-message" name="password" />
        </div>

        <div class="push-top">
          <button type="submit" class="btn-blue btn-block">Log in</button>
        </div>
        <div v-if="errorMessage != ''" class="error-message">
          {{ errorMessage }}
        </div>
        <div class="form-actions text-right">
          <router-link :to="{ name: RouteName.UserRegister }">
            Create an account?
          </router-link>
        </div>
      </vee-form>

      <div class="push-top text-center">
        <button @click="loginGoogle" class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign in with Google
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
        email: "",
        password: "",
      },
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      console.log(this.form);
      const result = await this.$store.dispatch(
        "auth/loginUserWithEmailAndPassword",
        this.form
      );
      if (result["name"] === "FirebaseError") {
        this.errorMessage = result.message;
      } else {
        console.log("UserLogin > login:", result);
        this.successRedirect();
      }
    },
    async loginGoogle() {
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
    this.$store.dispatch("notifyAppIsReady", "UserLogin");
  },
};
</script>

<style lang="scss" scoped></style>
