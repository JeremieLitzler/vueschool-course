<template>
  <div class="container">
    <suspense>
      <template #fallback>
        <!-- TODO: doesn't work... -->
        <section class="loading"><app-spinner /></section>
      </template>
      <template #default>
        <section>
          <the-header />
          <router-view :key="`${$route.path}${JSON.stringify($route.query)}`" />
        </section>
      </template>
    </suspense>
  </div>
  <app-notifications />
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
