<script>
  import { computed } from "vue";
  export default {
    props: {
      name: String,
      price: Number
    },
    setup(props, { emit}){
      const addToCart = () => emit("addToCart", props.name);
      const prettyPrice = computed(() => `$${props.price.toFixed(2)}`);

      return {
        prettyPrice,
        addToCart
      }
    }
  }
</script>

<template>
  <h2>{{ name }} @ {{ prettyPrice }}</h2>
  <button @click="addToCart">Add to cart</button>
</template>

<style scoped></style>
