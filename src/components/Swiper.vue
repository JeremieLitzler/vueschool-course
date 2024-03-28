<template>
  <section class="container">
    <ul ref="ulElement">
      <li>
        <slot :item="{ ...currentImage }"></slot>
      </li>
    </ul>
    <button
      v-show="showPrev"
      class="prev-slide"
      @click="$emit('change', index - 1)"
    >
      <
    </button>
    <button
      v-show="showNext"
      class="next-slide"
      @click="$emit('change', index + 1)"
    >
      >
    </button>
  </section>
  <section>
    <!-- <pre>List:{{ list }}</pre> -->
    <pre>Index:{{ index }}</pre>
    <pre>CurrentImageIndex:{{ currentImageIndex }}</pre>
    <pre>translate: {{ translate }}</pre>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
const props = defineProps({
  list: { type: Array, required: true },
  index: { type: Array, required: true },
});
defineEmits(['change']);
const ulElement = ref(null);
console.log('ulElement', ulElement.value);
const currentImage = computed(() => props.list[props.index]);
const currentImageIndex = computed(() => props.index + 1);
const showPrev = computed(() => currentImageIndex.value > 1);
const showNext = computed(() => currentImageIndex.value < props.list.length);
// const translate = computed(() => ulElement.value.offsetWidth);
</script>

<style lang="css" scoped>
ul {
  margin: 0;
  padding: 0;
  width: 400px;
  height: 200px;
  display: flex;
  justify-content: center;
}
li {
  list-style: none;
}
button {
  margin: 4px;
  align-self: center;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
}
.next-slide {
  position: absolute;
  top: 50%;
  right: 0%;
  transform: translate(-175%, -175%);
}
.prev-slide {
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translate(175%, -175%);
}
.next-slide {
  justify-self: right;
}
</style>
