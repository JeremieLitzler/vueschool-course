<script setup>
  import { ref } from 'vue';

  const colorsPickerArr = ref(['green', 'red', 'gold']);
  const vColor = (element, binding) => {
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
    setInterval(() => {
      element.style.color = colors[i];
      i++;
      if (i === colors.length) i = 0;
    }, speed);
  }

  setTimeout(() => {
    colorsPickerArr.value.push("orange")
  }, 5000);
</script>

<template>
  <h1 v-color:slow.italic="colorsPickerArr">My title</h1>
</template>
