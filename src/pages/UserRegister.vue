<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <vee-form
        @submit="register"
        class="card card-form"
        :validation-schema="{
          name: () => {
            if (value && value.trim()) return true;

            return 'This is required';
          },
          username: () => {
            if (value && value.trim()) return true;

            return 'This is required';
          },
        }"
      >
        <h1 class="text-center">Register</h1>

        <div class="form-group">
          <label for="name">Full Name</label>
          <vee-field
            name="name"
            v-model="form.name"
            id="name"
            type="text"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <vee-field
            name="username"
            v-model="form.username"
            id="username"
            type="text"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <vee-field
            name="email"
            v-model="form.email"
            id="email"
            type="email"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <vee-field
            name="password"
            v-model="form.password"
            id="password"
            type="password"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="avatar"
            >Avatar
            <div v-if="avatarPreview">
              <img :src="avatarPreview" class="avatar-xlarge" />
            </div>
          </label>
          <vee-field
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
import { Form, Field } from "vee-validate";
/* eslint-disable */
const { RouteName } = useRouteName();
/* eslint-enable */

export default {
  components: {
    VeeForm: Form,
    VeeField: Field,
  },
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
