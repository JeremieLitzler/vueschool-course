<template>
  <img :src="theSrc" :alt="alt" :class="cssClass" />
</template>

<script setup lang="ts">
interface AppAvatarImage {
  src?: string;
  alt: string;
  cssClass?: string;
}

const { src, alt, cssClass } = withDefaults(defineProps<AppAvatarImage>(), {
  src: '/img/user-placeholder.png',
  cssClass: 'avatar-xlarge',
});

const theSrc = src || '/img/user-placeholder.png';
//console.log(src, theSrc, alt, cssClass);
</script>
<style scoped>
img {
  object-fit: cover;
}
</style>
