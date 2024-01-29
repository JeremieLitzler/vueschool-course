<script setup>
import { onMounted, ref } from "vue"
const x = ref(0)
const y = ref(0)

onMounted(() => {
  document.addEventListener("mousemove", (event) => {    
    x.value = event.clientX;
    y.value = event.clientY;
  });
})

</script>

<template>
  <slot :x="x" :y="y" />
</template>