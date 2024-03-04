import { RouteName } from '@/enums/RouteName';
<template>
  <div class="col-full text-center">
    <h1>⛔ Sorry ⛔</h1>
    <p>The page requested is off limit...</p>
    <router-link :to="{ name: RouteName.TheHome }"
      >Back to a safe place</router-link
    >
  </div>
</template>

<script setup lang="ts">
import { RouteName } from '@/enums/RouteName';
</script>
