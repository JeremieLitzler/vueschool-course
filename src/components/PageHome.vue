<template>
  <h1>Welcome to the forum</h1>
  <ThreadList :threads="threads" />
</template>

<script>
import sourceData from "@/data.json";

import ThreadList from "./ThreadList.vue";
export default {
  data() {
    return {
      threads: sourceData.threads,
    };
  },
  components: {
    ThreadList,
  },
};
</script>

<style lang="scss" scoped></style>
