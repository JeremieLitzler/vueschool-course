<template>
  <div
    class="btn-hamburger"
    @click="toggleMobileMenu"
    v-click-outside="closeMobileMenu"
    v-page-scroll="closeMobileMenu"
  >
    <!-- use .btn-humburger-active to open the menu -->
    <div class="top bar"></div>
    <div class="middle bar"></div>
    <div class="bottom bar"></div>
  </div>
  <!-- use .navbar-open to open nav -->
  <nav class="navbar" :class="{ 'navbar-open': mobileMenuOpened }">
    <span
      v-if="!$store.getters.isAppIsReady"
      class="navbar-user navbar-loading"
    >
      <app-spinner background-color="#ffffff" />
    </span>
    <ul v-else>
      <li v-if="signedIn" class="navbar-user">
        <a
          @click.prevent="toggleMenu"
          v-click-outside="() => (userMenuOpened = false)"
          href="#"
        >
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
        <div id="user-dropdown" :class="{ 'active-drop': userMenuOpened }">
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
        <router-link :to="{ name: RouteName.UserLogin }">Login</router-link>
      </li>
      <li v-if="!signedIn" class="navbar-item">
        <router-link :to="{ name: RouteName.UserRegister }"
          >Register</router-link
        >
      </li>
      <li v-if="signedIn" class="navbar-mobile-item">
        <router-link :to="{ name: RouteName.AccountShow }">
          View profile</router-link
        >
      </li>
      <li v-if="signedIn" class="navbar-mobile-item">
        <a @click.prevent="logout">Log out</a>
      </li>
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
      userMenuOpened: false,
      mobileMenuOpened: false,
    };
  },
  computed: {
    authUser() {
      return this.$store.getters["auth/authUser"];
    },
    signedIn() {
      return this.$store.state.auth.authId;
    },
  },
  methods: {
    async logout() {
      await this.$store.dispatch("auth/logoutUser");
      this.$store.dispatch("notifyAppIsReady");
      this.$router.push({ name: RouteName.TheHome });
    },
    toggleMenu() {
      this.userMenuOpened = !this.userMenuOpened;
    },
    closeDropdown() {
      this.userMenuOpenedLocal = false;
    },
    toggleMobileMenu() {
      this.mobileMenuOpened = !this.mobileMenuOpened;
    },
    closeMobileMenu() {
      this.mobileMenuOpened = false;
    },
  },
  created() {
    console.log("created > prop userMenuOpened", this.mobileMenuOpened);
    console.log(
      "created > data userMenuOpenedLocal",
      this.mobileMenuOpenedLocal
    );
  },
  updated() {
    console.log("updated > prop userMenuOpened", this.mobileMenuOpened);
    console.log(
      "updated > data userMenuOpenedLocal",
      this.mobileMenuOpenedLocal
    );
  },
  beforeRouteLeave() {
    this.mobileMenuOpenedLocal = false;
    this.userMenuOpenedLocal = false;
  },
};
</script>
