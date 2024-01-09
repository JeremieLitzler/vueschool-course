<template>
  <h1>{{ appName }}</h1>
  <input type="text" v-model="appName" />
  <label>
    Currency
    <select v-model="currencySymbol">
      <option value="$">US Dollar</option>
      <option value="£">Sterling</option>
      <option value="€">Euro</option>
    </select>
  </label>
  <button @click="placeOrder">Place Order</button>
  <button @click="hideCartOnAddItem">Hide cart alerts</button>

  <YummyMeal
    v-for="meal in meals"
    :key="meal.name"
    :name="meal.name"
    :price="meal.price"
    :currencySymbol="currencySymbol"
    @addToCart="addItemToCart"
  />
</template>

<script setup>
  import { ref, reactive, watch, provide, onMounted } from "vue";
  import YummyMeal from "./components/YummyMeal.vue";

        const currencySymbol = ref("$");
        provide("currencySymbol", currencySymbol);
        const appName = ref("The Snazzy Burger");
        const cart = reactive([]);
        const meals = reactive([
          {name: "Hamburger", price: 5},
          {name: "Tacos", price: 7.55},
          {name: "Ceasar salad", price: 4},
          {name: "Nothing", price: 0}]);
        const placeOrder = () => {
          alert("You've ordered a great meal!");
        };
        const addItemToCart = (item) => {
          cart.push(item);
        }
        const hideCartOnAddItem = watch(() => [...cart], (newCart, oldCart) => alert(newCart.join('\n')));

        onMounted(() => {
          console.log(appName.value, "Mounted");
        })
</script>

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
