<script>
  import { ref, reactive, computed } from "vue";
  import YummyMeal from "./components/YummyMeal.vue";
    export default {
      components:{
        YummyMeal
      },
      setup() {
        const appName = ref("The Snazzy Burger");
        const meal = reactive({name: "Hamburger", price: 5});
        const placeOrder = () => {
          alert("You've ordered a great meal!")
        };
        const addItemToCart = (item) => {
          alert(`One ${item} was added to the cart`)
        }
        return { appName, meal, placeOrder, addItemToCart };
      }
    }
</script>

<template>
  <h1>{{ appName }}</h1>
  <button @click="placeOrder">Order</button>
  <YummyMeal :name="meal.name" :price="meal.price" @addToCart="addItemToCart" />
</template>

<style scoped>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
  }
</style>
