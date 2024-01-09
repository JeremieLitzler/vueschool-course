<template>
  <div class="meal">
    <h2>
      {{ name }} @
      <YummyMealPrice :price="price" />
    </h2>
    <button @click="addToCart">Add to cart</button>
  </div>
</template>

<script>
    import YummyMealPrice from "./YummyMealPrice.vue";
    export default {
      props: {
          name: String,
          price: Number,
      },
      setup(props, { emit }) {
          const addToCart = () => emit("addToCart", props.name);
          return {
              addToCart
          };
      },
      components: { YummyMealPrice }
  }
</script>

<style scoped>
  .meal {
    display: flex;
    justify-content: space-between;
    margin: .5em;
  }
</style>
