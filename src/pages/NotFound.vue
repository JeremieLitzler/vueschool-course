<template>
  <div class="col-full text-center push-top">
    <h1>Oops, the link isn't valid or doesn't exist anymore.</h1>
    <router-link :to="{ name: RouteName.TheHome }"
      >Back to a safe place</router-link
    >
  </div>
</template>

<script setup lang="ts">
import { RouteName } from '@/enums/RouteName';
</script>

<style lang="scss" scoped></style>
