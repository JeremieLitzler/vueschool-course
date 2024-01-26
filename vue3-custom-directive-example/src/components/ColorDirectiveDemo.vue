<script setup>
  import { ref } from 'vue';

  const show = ref(true);
  const colorsPickerArr = ref(['green', 'red', 'gold']);
  const vColor = {
    mounted(element, binding) {
      let i = 0;
      const speedsMs = {
        slow: 2000,
        normal: 1000,
        fast: 500,
      };

      const speedName = binding.arg || 'normal';
      const speed = speedsMs[speedName];
      const colors =  binding.value;

      if(binding.modifiers.underline) {
        element.style.textDecoration = "underline";
      }
      if(binding.modifiers.italic) {
        element.style.fontStyle = "italic";
      }
      //The double underscores are there to avoid name collisions.
      element.__ColorInterval__ = setInterval(() => {
        console.log("🖌️ Coloring");
        element.style.color = colors[i];
        i++;
        if (i === colors.length) i = 0;
      }, speed);
    },
    unmounted(element) {
      clearInterval(element.__ColorInterval__);
    }
  }

  setTimeout(() => {
    colorsPickerArr.value.push("orange")
  }, 5000);
</script>

<template>
  <h1 v-if="show" v-color:slow.italic="colorsPickerArr">My title</h1>
  <button @click="show = !show">Toogle</button>
</template>
