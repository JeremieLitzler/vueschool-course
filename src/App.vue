<template>
  <div class="container">
    <suspense>
      <template #fallback>
        <section class="loading">LOADING <app-spinner /></section>
      </template>
      <template #default>
        <section>
          <the-header />
          <router-view />
        </section>
      </template>
    </suspense>
  </div>
</template>
<script setup lang="ts">
// import { computed } from 'vue';
import { RouterView } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
// import { useCommonStore } from './stores/CommonStore';

// const fetchingSomething = computed(() => useCommonStore().fetching);
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
