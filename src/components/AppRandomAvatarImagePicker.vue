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

<script>
import arrayRandomHelper from "@/helpers/arrayRandomHelper";

export default {
  methods: {
    async pickRandomAvatar() {
      //Instead of Pixabay, we can also use picsum.photos.
      const randomImagesResult = await fetch(
        "https://picsum.photos/v2/list?limit=100"
      );
      const randomImages = await randomImagesResult.json();
      console.log("pickRandomAvatar>randomImages", randomImages);
      this.$emit("hit", arrayRandomHelper().pick(randomImages).download_url);
    },
  },
};
</script>

<style lang="scss" scoped></style>
