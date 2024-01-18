<template>
  <div>
    <h1>Product List</h1>
    <ul>
      <li v-for="product in products" :id="product.id">
        {{ product.title }} - {{ product.price }}
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import store from '@/store/index';
  import shop from '@/api/shop';

  const products = computed(() => store.getters.availableProducts);

  shop.getProducts(products => {
    store.commit('setProducts', products)
  })
</script>

<style lang="scss" scoped></style>
