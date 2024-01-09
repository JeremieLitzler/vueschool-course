<script>
  export default {
    props: {
      name: String,
      price: Number
    },
    setup(props, { emit}){
      const addToCart = () => emit("addToCart", props.name);
      return {
        addToCart
      }
    }
  }
</script>

<template>
  <h2>{{ name }} @ {{price }}</h2>
  <button @click="addToCart">Add to cart</button>
</template>

<style scoped></style>
