<template></template>

<script setup lang="ts">
definePageMeta({
  async middleware(to, from) {
    const isLoggedIn = useState<boolean>('isLoggedIn', () => false);
    isLoggedIn.value = false;
    console.log('logout>middleware>auth', {
      toName: to.name,
      fromName: from.name,
      userIsLoggedIn: isLoggedIn.value,
    });

    await useRouter().push({ name: 'index' });
  },
});
</script>

<style scoped></style>
