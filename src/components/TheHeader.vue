<template>
  <header class="header" id="header">
    <router-link :to="{ name: 'TheHome' }">
      <img src="../assets/img/svg/vueschool-logo.svg" />
    </router-link>

    <div class="btn-hamburger">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <the-nav-bar />
  </header>
</template>

<script>
import { useRouteName } from "@/composables/useRouteName";
/* eslint-disable */
const { RouteName } = useRouteName();
/* eslint-enable */
import TheNavBar from "./TheNavBar.vue";
export default {
  components: {
    TheNavBar,
  },
  data() {
    return {
      RouteName,
    };
  },
};
</script>
