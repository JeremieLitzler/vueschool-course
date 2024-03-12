<template>
  <img :src="src" :alt="alt" :class="cssClass" />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: "/img/user-placeholder.png",
    },
    cssClass: {
      type: String,
      default: "avatar-xlarge",
    },
    alt: {
      type: String,
      required: true,
    },
  },
};
</script>
