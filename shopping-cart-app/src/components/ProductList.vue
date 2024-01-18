<template>
  <div>
    <h1>Product List</h1>
    <p v-if="loading">Loading...</p>
    <ul v-else>
      <li v-for="product in products" :id="product.id">
        {{ product.title }} |
        {{ useCurrency(product.price, '$', 2) }}
        ({{ product.inventory > 0 ? `${product.inventory} left` : "Out of stock"

        }})

        <button @click="addProductToCart(product)">Add to cart</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { useStore } from 'vuex';
  import useCurrency  from '@/composables/useCurrency'

  const store = useStore();

  const loading = ref(true);

  store.dispatch("fetchProducts").then(() => loading.value = false);

  const products = computed(() => store.getters.availableProducts);

  const addProductToCart = (product) => {
    store.dispatch('addProductToCart', product);
  }
</script>

<style lang="scss" scoped></style>
