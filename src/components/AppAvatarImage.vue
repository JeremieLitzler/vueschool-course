<template>
  <img :src="theSrc" :alt="alt" :class="cssClass" />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
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
  data() {
    return {
      theSrc: this.src || "/img/user-placeholder.png",
    };
  },
};
</script>

<style scoped>
img {
  object-fit: cover;
}
</style>
