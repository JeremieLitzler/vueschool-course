<template>
  <div>
    <h1 class="title">Create Account</h1>

    <h2 class="subtitle">
      Create an account or log in to order your liquid gold subscription
    </h2>

    <form v-if="!loggedIn" class="form">
      <div class="form-group">
        <label class="form-label" for="email">Email</label>
        <input
          type="text"
          v-model="$v.form.email.$model"
          placeholder="your@email.com"
          class="form-control"
          id="email"
        />
        <div v-if="emailCheckedInDb" class="info">
          <a href="#" @click="logUserOff">&nbsp; Not you?</a>
        </div>
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
import { authenticateUser, checkIfUserExistsInDB } from "../api";
import { required, email } from "vuelidate/lib/validators";
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
    };
  },
  computed: {
    loggedIn() {
      return this.existingUser && this.form.name;
    },
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
        this.emailCheckedInDb = false;
        this.existingUser = false;
        return Promise.reject("Email is invalid");
      } else {
        this.$emit("updateAsyncState", "pending");
        return checkIfUserExistsInDB(this.form.email)
          .then(() => {
            this.existingUser = true;
            this.emailCheckedInDb = true;
            this.$emit("updateAsyncState", "success");
          })
          .catch(() => {
            this.existingUser = false;
            this.emailCheckedInDb = true;
            this.$emit("updateAsyncState", "failed");
          });
      }
    },
    loginUser() {
      this.wrongPassword = false;
      if (this.$v.form.password.$invalid) {
        return Promise.reject("Password is invalid");
      } else {
        this.$emit("updateAsyncState", "pending");
        return authenticateUser(this.form.email, this.form.password)
          .then((user) => {
            this.form.name = user.name;
            this.$emit("updateAsyncState", "success");
          })
          .catch(() => {
            this.$emit("updateAsyncState", "failed");
            this.wrongPassword = true;
          });
      }
    },
    logUserOff() {
      this.emailCheckedInDb = false;
      this.existingUser = false;
      this.wrongPassword = false;
      this.form.email = "";
      this.form.password = "";
      this.form.name = "";
    },
    submitStep() {
      let prerequisites = null;
      if (!this.emailCheckedInDb) {
        this.$v.form.email.$touch();
        prerequisites = this.checkUserExists();
      } else {
        if (this.existingUser) {
          this.$v.$touch();
          prerequisites = this.loginUser();
        } else {
          prerequisites = Promise.resolve();
        }
      }
      return new Promise((resolve, reject) => {
        prerequisites
          .then(() => {
            if (!this.$v.$invalid) {
              //resolve if data is valid
              resolve({
                email: this.form.email,
                password: this.form.password,
                name: this.form.name,
              });
            } else {
              //reject if data is invalid
              reject("Plan not selected");
            }
          })
          .catch((err) => reject(err));
      });
    },
  },
};
</script>

<style scoped></style>
