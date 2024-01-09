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
  <div class="meal">
    <h2>{{ name }} @ {{ prettyPrice }}</h2>
    <button @click="addToCart">Add to cart</button>
  </div>
</template>

<style scoped>
  .meal {
    display: flex;
    justify-content: space-between;
    margin: .5em;
  }
</style>
