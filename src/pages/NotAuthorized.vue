<template>
  <div class="col-full text-center">
    <h1>You can't do that, sorry.</h1>
    <p>The page requested is off limit... ⛔</p>
    <router-link :to="{ name: RouteName.TheHome }"
      >Back to a safe place</router-link
    >
  </div>
</template>

<script>
import { useRouteName } from "@/composables/useRouteName";
/* eslint-disable */
const { RouteName } = useRouteName();
/* eslint-enable */
export default {
  data() {
    return {
      RouteName,
    };
  },
};
</script>
