<template>
  <TheNavigation />

  <div class="container">
    <RouterView></RouterView>
  </div>
</template>

<script setup>
  import TheNavigation from '@/components/TheNavigation.vue';
</script>
<style scoped></style>
