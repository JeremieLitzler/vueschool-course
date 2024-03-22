<template></template>

<script setup lang="ts">
definePageMeta({
  async middleware(to, from) {
    const user = useUserStore();
    user.logout(to, from);
  },
});
</script>

<style scoped></style>
