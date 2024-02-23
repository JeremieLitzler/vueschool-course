<template>
  <suspense>
    <template #fallback>
      <section class="loading">Loading...</section>
    </template>
    <template #default>
      <section>
        <the-header />
        <div class="container"><router-view /></div>
      </section>
    </template>
  </suspense>
</template>
<script setup lang="ts">
// import { computed } from 'vue';
import { RouterView } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
// import { useCommonStore } from './stores/CommonStore';

// const fetchingSomething = computed(() => useCommonStore().fetching);
</script>

<style scoped></style>
