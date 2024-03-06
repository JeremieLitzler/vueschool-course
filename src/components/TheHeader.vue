<template>
  <header class="header" id="header">
    <router-link :to="{ name: 'TheHome' }">
      <img src="../assets/img/svg/vueschool-logo.svg" />
    </router-link>
    <the-nav-bar />
  </header>
</template>

<script>
import { useRouteName } from "@/helpers/routeNameEnum";
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
