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

/**
 * Load the src into the data prop unless it is null, otherwise use the placeholder.
 */
const theSrc = src || '/img/user-placeholder.png';
//console.log(src, theSrc, alt, cssClass);
</script>
<style scoped>
/**
 * Use for the random image show the center of the image
 */
img {
  object-fit: cover;
}
</style>
