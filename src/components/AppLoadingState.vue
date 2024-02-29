<template>
  <section class="loading">
    <app-spinner />
  </section>
</template>

<script>
export default {
  props: {
    message: { type: String, default: "Loading..." },
  },
};
</script>
