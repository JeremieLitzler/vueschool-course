<template>
  <h2>Click outside</h2>
  <div v-close="handleClickOutside" class="box">Here is some text</div>
</template>

<script setup>
  const handleClickOutside = () => alert("You clicked outside");
</script>
<style scoped>
  .box {
      display: block;
      border: 1px solid white;
      height: 20vh;
  }
</style>
