<template></template>

<script setup lang="ts">
definePageMeta({
  async middleware(to, from) {
    const user = useUserStore();
    user.isLoggedIn = false;
    console.log('logout>middleware>auth', {
      toName: to.name,
      fromName: from.name,
      userIsLoggedIn: user.isLoggedIn,
    });

    await useRouter().push({ name: 'index' });
  },
});
</script>

<style scoped></style>
