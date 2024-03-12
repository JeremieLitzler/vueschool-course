<template>
  <button class="btn-blue" @click.prevent="pickRandomAvatar">
    Pick a random avatar
  </button>
  <p class="credits">
    Thanks to
    <a href="http://picsum.photos" target="_blank" rel="noopener noreferrer"
      >Picsum.photos</a
    >
    for providing the images
  </p>
</template>

<script setup lang="ts">
// import arrayRandomHelper from '@/helpers/arrayRandomHelper';

// interface PicsumImage {
//   download_url: string;
// }

const emits = defineEmits<{
  (event: '@hit', url: string): void;
}>();
const pickRandomAvatar = async () => {
  // //Instead of Pixabay, we can also use picsum.photos.
  // const randomImagesResult = await fetch(
  //   'https://picsum.photos/v2/list?limit=100'
  // );
  // const randomImages = await randomImagesResult.json();
  // console.log('pickRandomAvatar>randomImages', randomImages);
  // emits(
  //   '@hit',
  //   arrayRandomHelper().pick<PicsumImage>(randomImages).download_url
  // );
  //-------------------------------------------------------
  //We will use the generic URL because it allows to pick a
  //random image too and make sure the size doesn't exceed
  //the firebase storage size limit
  emits('@hit', 'https://picsum.photos/400/400.webp');
};
</script>

<style scoped></style>
