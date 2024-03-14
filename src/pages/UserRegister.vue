<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <vee-form @submit="register" class="card card-form">
        <h1 class="text-center">Register</h1>
        <app-form-field
          name="name"
          label="Full Name"
          v-model="form.name"
          rules="required"
          type="text"
        />
        <app-form-field
          name="username"
          label="Username"
          v-model="form.username"
          rules="required|unique|unique:users,username"
          type="text"
        />
        <app-form-field
          name="email"
          label="Email"
          v-model="form.email"
          :rules="{
            required: true,
            email: true,
            unique: { collectionName: 'users', prop: 'email' },
          }"
          type="email"
        />
        <app-form-field
          name="password"
          label="Password"
          v-model="form.password"
          rules="required|min:8"
          type="password"
        />
        <div class="form-group">
          <label for="avatar"
            >Avatar
            <div v-if="avatarPreview">
              <img :src="avatarPreview" class="avatar-xlarge" />
            </div>
          </label>
          <input
            name="avatar"
            v-show="!avatarPreview"
            id="avatar"
            type="file"
            accept="image/*"
            class="form-input"
            @change="handleImageUpload"
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
      </vee-form>
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
      avatarPreview: null,
    };
  },
  methods: {
    async register() {
      //console.log("Form>", this.form);
      await this.$store.dispatch("auth/registerUserWithEmailAndPassword", {
        ...this.form,
      });
      //console.log("Created user >", user);
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
    handleImageUpload(event) {
      this.form.avatar = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        this.avatarPreview = readerEvent.target.result;
      };
      if (this.form.avatar) reader.readAsDataURL(this.form.avatar);
    },
  },
  created() {
    this.$store.dispatch("notifyAppIsReady", "UserRegister");
  },
};
</script>

<style lang="css" scoped></style>
