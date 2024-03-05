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
          <router-view :key="route.fullPath" />
        </section>
      </template>
    </suspense>
  </div>
</template>
<script setup lang="ts">
// import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
const route = useRoute();
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
