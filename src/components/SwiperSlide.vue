<template>
  <img :src="image" :alt="`Image ${title}`" width="400" height="200" />
</template>

<script setup>
defineProps({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});
</script>
