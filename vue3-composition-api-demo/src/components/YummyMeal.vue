<template>
  <div class="meal">
    <h2>
      {{ name }} @
      <YummyMealPrice :price="price" />
    </h2>
    <button @click="addToCart">Add to cart</button>
  </div>
</template>

<script setup>
  import YummyMealPrice from "./YummyMealPrice.vue";

  const emit = defineEmits(["addToCart"]);
  defineProps({
        name: String,
        price: Number,
    });

  const addToCart = () => emit("addToCart", props.name);
</script>

<style scoped>
  .meal {
    display: flex;
    justify-content: space-between;
    margin: .5em;
  }
</style>
