<template>
  <h1>Playing with responsive images and modifiers using NuxtImage</h1>
  <form>
    <section>
      <h2>Crop settings</h2>
      <p>You need to set <i>width</i> and <i>height</i> to execute the crop.</p>
      <article>
        <label>
          Width
          <input
            v-model="crop.width"
            type="range"
            step="50"
            min="0"
            max="1536"
          />
        </label>
        <label>
          Height
          <input
            v-model="crop.height"
            type="range"
            step="50"
            min="0"
            max="1000"
          />
        </label>
        <label>
          Top
          <input v-model="crop.top" type="range" step="50" min="0" max="1000" />
        </label>
        <label>
          Left
          <input
            v-model="crop.left"
            type="range"
            step="50"
            min="0"
            max="1536"
          />
        </label>
      </article>
    </section>
    <section>
      <h2>Styling Modifiers</h2>
      <article>
        <label>
          Flip
          <input v-model="modifiers.flip" type="checkbox" />
        </label>
        <label>
          Flop
          <input v-model="modifiers.flop" type="checkbox" />
        </label>
        <label>
          Sharpen
          <input v-model="modifiers.sharpen" type="checkbox" />
        </label>
        <label>
          Blur
          <input v-model="modifiers.blur" type="checkbox" />
        </label>
        <label>
          Negate
          <input v-model="modifiers.negate" type="checkbox" />
        </label>
        <label>
          Tint
          <input v-model="modifiers.tint" type="color" />
        </label>
        <label>
          Grayscale
          <input v-model="modifiers.grayscale" type="checkbox" />
        </label>
      </article>
    </section>
  </form>
  <nuxt-img
    src="/unsplash.jpg"
    width="1920"
    sizes="xs:100vw sm:50vw md:100vw"
    format="avif"
    :modifiers="{
      ...modifiers,
      extract: extract,
    }"
  />
</template>

<script setup lang="ts">
const modifiers = ref({
  quality: 100,
  flip: undefined,
  flop: undefined,
  sharpen: undefined,
  blur: undefined,
  negate: undefined,
  tint: undefined,
  grayscale: undefined,
});
const crop = ref({
  left: 0,
  top: 0,
  width: 0,
  height: 0,
});
const extract = computed(() => {
  if (crop.value.width && crop.value.height)
    return `${crop.value.left}_${crop.value.top}_${crop.value.width}_${crop.value.height}`;
  return;
});
</script>

<style scoped>
img {
  display: block;
  max-width: 100%;
}

form section article {
  display: flex;
  align-items: center;
  gap: 1em;
}
</style>
