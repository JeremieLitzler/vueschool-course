<template>
  <div class="col-full text-center">
    <h1>Oops, the link isn't valid</h1>
    <router-link :to="{ name: RouteName.TheHome }"
      >Back to a safe place</router-link
    >
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
    };
  },
};
</script>

<style lang="scss" scoped></style>
@/helpers/routeNameEnum @/helpers/routeNameEnum
