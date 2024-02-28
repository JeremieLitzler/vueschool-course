<template>
  <section class="loading">
    {{ message }}
  </section>
</template>

<script>
export default {
  props: {
    message: { type: String, default: "Loading..." },
  },
};
</script>
