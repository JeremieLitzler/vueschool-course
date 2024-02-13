<template>
  <h1>Welcome to the forum</h1>
  <ThreadList />
</template>

<script>
import ThreadList from "./ThreadList.vue";
export default {
  components: {
    ThreadList,
  },
};
</script>

<style lang="scss" scoped></style>
