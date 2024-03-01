<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form @submit.prevent="login" class="card card-form">
        <h1 class="text-center">Login</h1>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model="form.email"
            id="email"
            type="text"
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
      </form>

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
        "loginUserWithEmailAndPassword",
        this.form
      );
      if (result["name"] === "FirebaseError") {
        this.errorMessage = result.message;
      } else {
        console.log("UserLogin > login:", result);
        this.$router.push({ name: RouteName.TheHome });
      }
    },
    async loginGoogle() {
      this.$store.dispatch("loginWithGoogle");
      this.$router.push({ name: RouteName.TheHome });
    },
  },
};
</script>

<style lang="scss" scoped></style>
