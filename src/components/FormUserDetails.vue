<template>
  <div>
    <h1 class="title">Create Account</h1>

    <h2 class="subtitle">
      Create an account or log in to order your liquid gold subscription
    </h2>

    <form v-if="!loggedIn" @input="setData" class="form">
      <div class="form-group">
        <label class="form-label" for="email">Email</label>
        <input
          @input="checkUserExists"
          type="text"
          v-model="$v.form.email.$model"
          placeholder="your@email.com"
          class="form-control"
          id="email"
        />
        <div
          v-if="$v.form.email.$error && !$v.form.email.required"
          class="error"
        >
          email is required
        </div>
        <div v-if="$v.form.email.$error && !$v.form.email.email" class="error">
          email is invalid
        </div>
      </div>

      <div v-if="emailCheckedInDb" class="form-group">
        <label class="form-label" for="password">Password</label>
        <input
          v-model="$v.form.password.$model"
          type="password"
          placeholder="Super Secret Password"
          class="form-control"
          id="password"
        />
        <div
          v-if="$v.form.password.$error && !$v.form.password.required"
          class="error"
        >
          password is required
        </div>
        <div
          v-if="$v.form.password.$error && !$v.form.password.correct"
          class="error"
        >
          password is invalid - try again
        </div>
      </div>

      <div v-if="existingUser" class="form-group">
        <button @click.prevent="loginUser" class="btn">Login</button>
      </div>

      <div v-if="emailCheckedInDb && !existingUser" class="form-group">
        <label class="form-label" for="name">Name</label>
        <input
          v-model="$v.form.name.$model"
          type="text"
          placeholder="What should we call you?"
          class="form-control"
          id="name"
        />
        <div v-if="$v.form.name.$error" class="error">name is required</div>
      </div>
    </form>
    <div v-else class="text-center">
      Successfully logged in!
      <a href="#" @click="logUserOff">Not {{ form.name }}?</a>
    </div>
  </div>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import { authenticateUser, checkIfUserExistsInDB } from "../api/index";

export default {
  data() {
    return {
      form: {
        email: null,
        password: null,
        name: null,
      },
      emailCheckedInDb: false,
      existingUser: false,
      wrongPassword: false,
      loggedIn: false,
    };
  },
  validations: {
    form: {
      email: {
        required,
        email,
      },
      password: {
        required,
        correct() {
          return !this.wrongPassword;
        },
      },
      name: {
        required,
      },
    },
  },
  methods: {
    checkUserExists() {
      if (this.$v.form.email.$invalid) {
        console.log("checkUserExists > form.email.$invalid = true");
        this.emailCheckedInDb = false;
        this.existingUser = false;
        return;
      }

      console.log("checkUserExists > form.email.$invalid = false");
      return checkIfUserExistsInDB(this.form.email)
        .then(() => {
          console.log("checkUserExists > run then()");
          this.existingUser = true;
          this.emailCheckedInDb = true;
        })
        .catch(() => {
          console.log("checkUserExists > run catch()");
          this.existingUser = false;
          this.emailCheckedInDb = true;
        });
    },
    loginUser() {
      if (this.$v.form.email.$invalid) {
        return;
      }
      this.wrongPassword = false;

      return authenticateUser(this.form.email, this.form.password)
        .then((user) => {
          this.form.name = user.name;
          this.loggedIn = true;
          this.setData();
        })
        .catch(() => (this.wrongPassword = true));
    },
    logUserOff() {
      this.loggedIn = false;
      this.emailCheckedInDb = false;
      this.existingUser = false;
      this.wrongPassword = false;
      this.form.email = "";
      this.form.password = "";
      this.form.name = "";
    },
    setData() {
      this.$emit("sendStepData", {
        data: {
          email: this.form.email,
          password: this.form.password,
          name: this.form.name,
        },
        isValid: !this.$v.$invalid,
      });
    },
  },
};
</script>

<style scoped></style>
