<script setup>
  const vColor = (element, binding) => {
    let i = 0;
    const colors =  binding.value;
    setInterval(() => {
        element.style.color = colors[i];
        i++;
        if (i === colors.length) i = 0;
    }, 500);
    }
</script>

<template>
  <h1 v-color="['green', 'red', 'gold']">My title</h1>
</template>
