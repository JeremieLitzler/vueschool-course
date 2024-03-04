<template>
  <!-- use .navbar-open to open nav -->
  <nav class="navbar">
    <ul>
      <li v-if="signedIn" class="navbar-user">
        <a @click.prevent="toggleMenu" href="#">
          <img
            class="avatar-small"
            :src="authUser?.avatar"
            :alt="`${authUser?.name} profile picture`"
          />
          <!-- <span style="color: aliceblue" v-if="$store.getters.isAppIsReady">
            Connected user not loaded...</span
          > -->
          <span>
            {{ authUser?.name }}
            <img
              class="icon-profile"
              src="../assets/img/svg/arrow-profile.svg"
              alt=""
            />
          </span>
        </a>

        <!-- dropdown menu -->
        <!-- add class "active-drop" to show the dropdown -->
        <div id="user-dropdown" :class="{ 'active-drop': menuOpened }">
          <div class="triangle-drop"></div>
          <ul class="dropdown-menu">
            <li class="dropdown-menu-item">
              <router-link :to="{ name: RouteName.AccountShow }">
                View profile</router-link
              >
            </li>
            <li class="dropdown-menu-item">
              <a @click.prevent="logout">Log out</a>
            </li>
          </ul>
        </div>
      </li>
      <li v-if="!signedIn" class="navbar-item">
        <router-link class="navbar-user" :to="{ name: RouteName.UserRegister }"
          >Register</router-link
        >
      </li>
      <li v-if="!signedIn" class="navbar-item">
        <router-link class="navbar-user" :to="{ name: RouteName.UserLogin }"
          >Login</router-link
        >
      </li>
    </ul>

    <ul>
      <li class="navbar-item">
        <router-link :to="{ name: RouteName.TheHome }">Home</router-link>
      </li>

      <!-- <li class="navbar-item">
          <a href="category.html">Category</a>
        </li>
        <li class="navbar-item">
          <a href="forum.html">Forum</a>
        </li>
        <li class="navbar-item">
          <a href="thread.html">Thread</a>
        </li>
        -->
      <!-- Show these option only on mobile-->
      <!-- <li class="navbar-item mobile-only">
          <a href="profile.html">My Profile</a>
        </li>
        <li class="navbar-item mobile-only">
          <a href="#">Logout</a>
        </li> -->
    </ul>
  </nav>
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
      menuOpened: false,
    };
  },
  computed: {
    authUser() {
      return this.$store.getters.authUser;
    },
    signedIn() {
      console.log("TheNavBar > signedIn", this.$store.state.authId);
      return this.$store.state.authId;
    },
  },
  methods: {
    logout() {
      //console.log("TheNavBar > logout > start");
      this.$store.dispatch("logoutUser");
      this.$router.push({ name: RouteName.TheHome });
      //console.log("TheNavBar > logout > done!");
    },
    toggleMenu() {
      this.menuOpened = !this.menuOpened;
    },
  },
};
</script>
