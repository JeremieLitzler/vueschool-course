<template>
  <h2>Click outside</h2>
  <div v-close="handleClickOutside" class="box">Here is some text</div>
</template>

<script setup>
  const handleClickOutside = () => alert("You clicked outside");
  const vClose = {
      mounted(element, binding) {
          element.__ClickOutsideHandler__ = (event) => {
              if (!(element === event.target || element.contains(event.target))) {
                  binding.value(event);
              };
          }
          document.body.addEventListener("click", element.__ClickOutsideHandler__)
      },
      unmounted(element) {
          document.body.removeEventListener("click", element.__ClickOutsideHandler__);
      }
  }
</script>
<style scoped>
  .box {
      display: block;
      border: 1px solid white;
      height: 20vh;
  }
</style>
